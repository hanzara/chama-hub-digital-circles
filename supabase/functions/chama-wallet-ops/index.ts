import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) throw new Error('Not authenticated');

    const { operation, chamaId, amount, walletType, recipient, paymentMethod } = await req.json();

    console.log('Wallet operation:', { operation, chamaId, amount, walletType, user: user.id });

    // Get member record
    const { data: member } = await supabase
      .from('chama_members')
      .select('*')
      .eq('user_id', user.id)
      .eq('chama_id', chamaId)
      .single();

    if (!member) throw new Error('Not a chama member');

    switch (operation) {
      case 'topup': {
        // Top up MGR wallet from savings
        if (member.savings_balance < amount) {
          throw new Error('Insufficient savings balance');
        }

        await supabase
          .from('chama_members')
          .update({
            savings_balance: member.savings_balance - amount,
            mgr_balance: member.mgr_balance + amount
          })
          .eq('id', member.id);

        // Log transaction
        await supabase
          .from('chama_wallet_transactions')
          .insert({
            chama_id: chamaId,
            transaction_type: 'transfer',
            amount: amount,
            description: `Top up MGR wallet from savings`,
            processed_by: member.id
          });

        // Send notification
        await supabase
          .from('chama_notifications')
          .insert({
            chama_id: chamaId,
            user_id: user.id,
            title: 'Wallet Top-Up Successful',
            message: `Successfully topped up KES ${amount} to your MGR wallet`,
            type: 'contribution'
          });

        return new Response(JSON.stringify({ success: true, message: 'Top-up successful' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'withdraw': {
        // Withdraw from MGR wallet
        if (member.withdrawal_locked) {
          throw new Error('Withdrawals are currently locked');
        }

        if (member.mgr_balance < amount) {
          throw new Error('Insufficient MGR balance');
        }

        await supabase
          .from('chama_members')
          .update({
            mgr_balance: member.mgr_balance - amount
          })
          .eq('id', member.id);

        // Log transaction
        await supabase
          .from('chama_wallet_transactions')
          .insert({
            chama_id: chamaId,
            transaction_type: 'withdrawal',
            amount: amount,
            description: `Withdrawal to ${paymentMethod || 'account'}`,
            processed_by: member.id,
            payment_method: paymentMethod
          });

        // Audit log
        await supabase
          .from('chama_audit_logs')
          .insert({
            chama_id: chamaId,
            action: 'mgr_withdrawal',
            actor_id: user.id,
            target_id: member.id,
            new_value: (member.mgr_balance - amount).toString(),
            details: { amount, paymentMethod }
          });

        // Notification
        await supabase
          .from('chama_notifications')
          .insert({
            chama_id: chamaId,
            user_id: user.id,
            title: 'Withdrawal Processed',
            message: `Successfully withdrew KES ${amount} from your MGR wallet`,
            type: 'unlock'
          });

        return new Response(JSON.stringify({ success: true, message: 'Withdrawal successful' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'send': {
        // Send from MGR wallet to another member
        if (member.mgr_balance < amount) {
          throw new Error('Insufficient MGR balance');
        }

        const { data: recipientMember } = await supabase
          .from('chama_members')
          .select('*')
          .eq('id', recipient)
          .eq('chama_id', chamaId)
          .single();

        if (!recipientMember) throw new Error('Recipient not found');

        // Deduct from sender
        await supabase
          .from('chama_members')
          .update({
            mgr_balance: member.mgr_balance - amount
          })
          .eq('id', member.id);

        // Add to recipient
        await supabase
          .from('chama_members')
          .update({
            mgr_balance: recipientMember.mgr_balance + amount
          })
          .eq('id', recipient);

        // Log transaction
        await supabase
          .from('chama_wallet_transactions')
          .insert({
            chama_id: chamaId,
            transaction_type: 'transfer',
            amount: amount,
            description: `Transfer to member`,
            processed_by: member.id
          });

        // Notifications
        await supabase
          .from('chama_notifications')
          .insert([
            {
              chama_id: chamaId,
              user_id: user.id,
              title: 'Transfer Sent',
              message: `Successfully sent KES ${amount} to another member`,
              type: 'contribution'
            },
            {
              chama_id: chamaId,
              user_id: recipientMember.user_id,
              title: 'Money Received',
              message: `You received KES ${amount} from another member`,
              type: 'contribution'
            }
          ]);

        return new Response(JSON.stringify({ success: true, message: 'Transfer successful' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'unlock': {
        // Admin/Creator can unlock withdrawals for a member
        if (member.role !== 'admin' && member.role !== 'chairman') {
          throw new Error('Only admins can unlock withdrawals');
        }

        await supabase
          .from('chama_members')
          .update({ withdrawal_locked: false })
          .eq('id', recipient);

        // Audit
        await supabase
          .from('chama_audit_logs')
          .insert({
            chama_id: chamaId,
            action: 'unlock_withdrawal',
            actor_id: user.id,
            target_id: recipient,
            details: { action: 'unlock' }
          });

        // Notify member
        const { data: targetMember } = await supabase
          .from('chama_members')
          .select('user_id')
          .eq('id', recipient)
          .single();

        if (targetMember) {
          await supabase
            .from('chama_notifications')
            .insert({
              chama_id: chamaId,
              user_id: targetMember.user_id,
              title: 'Withdrawal Unlocked',
              message: 'Your MGR wallet withdrawal has been unlocked',
              type: 'unlock'
            });
        }

        return new Response(JSON.stringify({ success: true, message: 'Withdrawal unlocked' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid operation');
    }

  } catch (error) {
    console.error('Wallet operation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Operation failed' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});