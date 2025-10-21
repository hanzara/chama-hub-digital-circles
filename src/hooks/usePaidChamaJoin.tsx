import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useChamaPayments } from './useChamaPayments';
import { usePaystackIntegration } from './usePaystackIntegration';

export const usePaidChamaJoin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mpesaContributionMutation } = useChamaPayments();
  const { initializePayment: initializePaystack } = usePaystackIntegration();

  // Check payment status for a chama join
  const checkPaymentStatus = async (paymentReference: string) => {
    const { data, error } = await supabase
      .from('chama_payment_verifications')
      .select('*')
      .eq('payment_reference', paymentReference)
      .single();

    if (error) throw error;
    return data;
  };

  // Get pending payment verifications
  const { data: pendingPayments, refetch: refetchPending } = useQuery({
    queryKey: ['pending-chama-payments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('chama_payment_verifications')
        .select(`
          *,
          chamas(name, logo_url)
        `)
        .eq('user_id', user.id)
        .eq('payment_status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 5000 // Poll every 5 seconds
  });

  // Initialize payment for chama joining
  const initiatePayment = useMutation({
    mutationFn: async ({ 
      chamaId, 
      amount, 
      paymentMethod,
      phoneNumber,
      email 
    }: {
      chamaId: string;
      amount: number;
      paymentMethod: 'mpesa' | 'paystack';
      phoneNumber?: string;
      email?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Get chama details
      const { data: chama, error: chamaError } = await supabase
        .from('chamas')
        .select('name, joining_fee')
        .eq('id', chamaId)
        .single();

      if (chamaError) throw chamaError;

      // Create payment verification record
      const paymentReference = `chama_${chamaId}_${Date.now()}`;
      
      const { error: verificationError } = await supabase
        .from('chama_payment_verifications')
        .insert({
          user_id: user.id,
          chama_id: chamaId,
          payment_reference: paymentReference,
          amount,
          payment_method: paymentMethod
        });

      if (verificationError) throw verificationError;

      // Initialize payment based on method
      if (paymentMethod === 'mpesa') {
        if (!phoneNumber) throw new Error('Phone number required for M-Pesa');
        
        return mpesaContributionMutation.mutateAsync({
          chamaId,
          phoneNumber,
          amount,
          description: `Join ${chama.name} - Joining Fee`
        });
      } else {
        return initializePaystack.mutateAsync({
          email: email || user.email,
          amount,
          description: `Join ${chama.name} - Joining Fee`,
          purpose: 'contribution',
          chamaId,
          channels: ['card', 'bank', 'ussd', 'mobile_money', 'bank_transfer']
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Payment Initiated 💳",
        description: "Complete your payment to join the chama. Your membership will be activated automatically after payment verification.",
      });
      queryClient.invalidateQueries({ queryKey: ['pending-chama-payments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Initiation Failed",
        description: error.message || "Failed to start payment process",
        variant: "destructive"
      });
    }
  });

  // Manually check payment status
  const verifyPayment = useMutation({
    mutationFn: async (paymentReference: string) => {
      const status = await checkPaymentStatus(paymentReference);
      
      if (status.payment_status === 'verified') {
        return { success: true, message: 'Payment verified and membership activated!' };
      } else if (status.payment_status === 'failed') {
        throw new Error('Payment failed. Please try again.');
      } else if (new Date(status.expires_at) < new Date()) {
        throw new Error('Payment verification expired. Please initiate a new payment.');
      } else {
        throw new Error('Payment is still pending verification.');
      }
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Membership Activated",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['user-chamas'] });
      queryClient.invalidateQueries({ queryKey: ['pending-chama-payments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Request to join chama with payment requirement check
  const requestToJoin = useMutation({
    mutationFn: async ({ 
      chamaId, 
      details 
    }: {
      chamaId: string;
      details: {
        full_name: string;
        phone_number: string;
        occupation?: string;
        reason: string;
      };
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Check if chama requires payment
      const { data: chama, error: chamaError } = await supabase
        .from('chamas')
        .select('require_payment, joining_fee')
        .eq('id', chamaId)
        .single();

      if (chamaError) throw chamaError;

      // Update or create profile
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: details.full_name,
          phone_number: details.phone_number,
          occupation: details.occupation || null,
        }, {
          onConflict: 'user_id'
        });

      return {
        requiresPayment: chama.require_payment,
        joiningFee: chama.joining_fee || 0,
        chamaId
      };
    },
    onSuccess: (data) => {
      if (data.requiresPayment && data.joiningFee > 0) {
        toast({
          title: "Payment Required 💳",
          description: `This chama requires a joining fee of KES ${data.joiningFee}. Please complete payment to join.`,
        });
      } else {
        toast({
          title: "Request Sent ✓",
          description: "Your request to join the chama has been sent for approval.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send join request",
        variant: "destructive"
      });
    }
  });

  return {
    initiatePayment,
    verifyPayment,
    requestToJoin,
    pendingPayments,
    refetchPending,
    checkPaymentStatus,
    isInitiatingPayment: initiatePayment.isPending,
    isVerifying: verifyPayment.isPending
  };
};
