-- Add payment tracking for chama memberships
ALTER TABLE chama_members 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Create index for efficient payment status queries
CREATE INDEX IF NOT EXISTS idx_chama_members_payment_status ON chama_members(payment_status);
CREATE INDEX IF NOT EXISTS idx_chama_members_payment_reference ON chama_members(payment_reference);

-- Add joining fee to chamas table
ALTER TABLE chamas 
ADD COLUMN IF NOT EXISTS joining_fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS require_payment BOOLEAN DEFAULT false;

-- Create chama_payment_verifications table to track all payment attempts
CREATE TABLE IF NOT EXISTS chama_payment_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chama_id UUID NOT NULL REFERENCES chamas(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES chama_members(id) ON DELETE SET NULL,
  payment_reference TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed', 'expired')),
  verification_data JSONB,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 minutes'),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on payment verifications
ALTER TABLE chama_payment_verifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment verifications
CREATE POLICY "Users can view own payment verifications"
  ON chama_payment_verifications FOR SELECT
  USING (auth.uid() = user_id);

-- Only system (service role) can insert/update payment verifications
CREATE POLICY "Service role can manage payment verifications"
  ON chama_payment_verifications FOR ALL
  USING (auth.role() = 'service_role');

-- Create function to verify payment and activate membership
CREATE OR REPLACE FUNCTION verify_chama_payment(
  p_payment_reference TEXT,
  p_amount DECIMAL,
  p_payment_method TEXT,
  p_verification_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_verification chama_payment_verifications;
  v_membership chama_members;
  v_result JSONB;
BEGIN
  -- Find pending payment verification
  SELECT * INTO v_verification
  FROM chama_payment_verifications
  WHERE payment_reference = p_payment_reference
    AND payment_status = 'pending'
    AND expires_at > now();

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment verification not found or expired'
    );
  END IF;

  -- Verify amount matches
  IF v_verification.amount != p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment amount mismatch'
    );
  END IF;

  -- Update verification record
  UPDATE chama_payment_verifications
  SET 
    payment_status = 'verified',
    payment_method = p_payment_method,
    verification_data = p_verification_data,
    verified_at = now(),
    updated_at = now()
  WHERE id = v_verification.id;

  -- Update or create membership
  IF v_verification.membership_id IS NOT NULL THEN
    -- Update existing membership
    UPDATE chama_members
    SET 
      is_active = true,
      payment_status = 'paid',
      payment_reference = p_payment_reference,
      payment_amount = p_amount,
      payment_date = now(),
      payment_method = p_payment_method,
      updated_at = now()
    WHERE id = v_verification.membership_id
    RETURNING * INTO v_membership;
  ELSE
    -- Create new membership
    INSERT INTO chama_members (
      chama_id,
      user_id,
      role,
      is_active,
      payment_status,
      payment_reference,
      payment_amount,
      payment_date,
      payment_method
    ) VALUES (
      v_verification.chama_id,
      v_verification.user_id,
      'member',
      true,
      'paid',
      p_payment_reference,
      p_amount,
      now(),
      p_payment_method
    )
    RETURNING * INTO v_membership;

    -- Update verification with membership_id
    UPDATE chama_payment_verifications
    SET membership_id = v_membership.id
    WHERE id = v_verification.id;
  END IF;

  -- Log activity
  INSERT INTO chama_activities (
    chama_id,
    member_id,
    activity_type,
    description
  ) VALUES (
    v_verification.chama_id,
    v_membership.id,
    'member_joined',
    'New member joined after payment verification'
  );

  -- Create notification
  INSERT INTO chama_notifications (
    user_id,
    chama_id,
    type,
    title,
    message,
    data
  )
  SELECT 
    v_verification.user_id,
    v_verification.chama_id,
    'membership_activated',
    '🎉 Welcome to the Chama!',
    'Your payment has been verified and membership activated.',
    jsonb_build_object(
      'payment_reference', p_payment_reference,
      'amount', p_amount,
      'payment_method', p_payment_method
    );

  RETURN jsonb_build_object(
    'success', true,
    'membership_id', v_membership.id,
    'chama_id', v_verification.chama_id
  );
END;
$$;

-- Create function to handle failed payments
CREATE OR REPLACE FUNCTION mark_payment_failed(
  p_payment_reference TEXT,
  p_failure_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_verification chama_payment_verifications;
BEGIN
  -- Update verification status
  UPDATE chama_payment_verifications
  SET 
    payment_status = 'failed',
    verification_data = jsonb_build_object('failure_reason', p_failure_reason),
    updated_at = now()
  WHERE payment_reference = p_payment_reference
    AND payment_status = 'pending'
  RETURNING * INTO v_verification;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment verification not found'
    );
  END IF;

  -- Update membership if exists
  IF v_verification.membership_id IS NOT NULL THEN
    UPDATE chama_members
    SET 
      payment_status = 'failed',
      updated_at = now()
    WHERE id = v_verification.membership_id;
  END IF;

  -- Notify user
  INSERT INTO chama_notifications (
    user_id,
    chama_id,
    type,
    title,
    message,
    data
  ) VALUES (
    v_verification.user_id,
    v_verification.chama_id,
    'payment_failed',
    '❌ Payment Failed',
    'Your payment could not be completed. Please try again.',
    jsonb_build_object(
      'payment_reference', p_payment_reference,
      'failure_reason', p_failure_reason
    )
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Update RLS policies for chama_members to enforce payment verification
DROP POLICY IF EXISTS "Users can view chama members" ON chama_members;
CREATE POLICY "Users can view chama members"
  ON chama_members FOR SELECT
  USING (
    -- User can see members of chamas they belong to (and are paid members)
    EXISTS (
      SELECT 1 FROM chama_members cm
      WHERE cm.chama_id = chama_members.chama_id
        AND cm.user_id = auth.uid()
        AND cm.is_active = true
        AND cm.payment_status = 'paid'
    )
    OR
    -- Or if they're viewing public chama info
    chama_members.is_active = true
  );

COMMENT ON TABLE chama_payment_verifications IS 'Tracks payment verification for chama memberships with webhook security';