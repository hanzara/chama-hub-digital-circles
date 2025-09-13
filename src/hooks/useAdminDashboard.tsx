
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useAdminDashboard = (chamaId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all chama activities
  const activitiesQuery = useQuery({
    queryKey: ['admin-activities', chamaId],
    queryFn: async () => {
      console.log('Fetching admin activities for chama:', chamaId);

      // Mock data for demo purposes
      return [
        {
          id: '1',
          activity_type: 'contribution',
          description: 'Monthly contribution received',
          amount: 15000,
          created_at: new Date().toISOString(),
          chama_members: {
            profiles: { full_name: 'John Doe', email: 'john@example.com' }
          }
        }
      ];
    },
    enabled: !!chamaId && !!user,
  });

  // Fetch wallet transactions
  const walletTransactionsQuery = useQuery({
    queryKey: ['admin-wallet-transactions', chamaId],
    queryFn: async () => {
      console.log('Fetching wallet transactions for chama:', chamaId);

      // Mock data for demo purposes
      return [
        {
          id: '1',
          amount: 15000,
          transaction_type: 'credit',
          description: 'Member contribution',
          created_at: new Date().toISOString(),
          chama_members: {
            profiles: { full_name: 'John Doe', email: 'john@example.com' }
          }
        }
      ];
    },
    enabled: !!chamaId && !!user,
  });

  // Fetch member statistics
  const memberStatsQuery = useQuery({
    queryKey: ['admin-member-stats', chamaId],
    queryFn: async () => {
      console.log('Fetching member stats for chama:', chamaId);

      // Mock data for demo purposes
      return [
        {
          id: '1',
          user_id: '1',
          total_contributed: 125000,
          last_contribution_date: new Date().toISOString(),
          joined_at: new Date().toISOString(),
          is_active: true,
          role: 'member',
          profiles: {
            full_name: 'John Doe',
            email: 'john@example.com',
            phone_number: '+254712345678'
          }
        }
      ];
    },
    enabled: !!chamaId && !!user,
  });

  // Fetch financial metrics
  const financialMetricsQuery = useQuery({
    queryKey: ['admin-financial-metrics', chamaId],
    queryFn: async () => {
      console.log('Fetching financial metrics for chama:', chamaId);

      // Mock data for demo purposes
      const contributions = [
        { amount: 15000, contribution_date: new Date().toISOString() },
        { amount: 15000, contribution_date: new Date().toISOString() }
      ];
      
      const loans = [
        { amount: 50000, status: 'active', created_at: new Date().toISOString() }
      ];

      // Calculate metrics
      const totalContributions = contributions?.reduce((sum, c) => sum + c.amount, 0) || 0;
      const totalLoans = loans?.reduce((sum, l) => sum + l.amount, 0) || 0;
      const activeLoans = loans?.filter(l => l.status === 'active').length || 0;
      
      // Monthly metrics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyContributions = contributions?.filter(c => {
        const date = new Date(c.contribution_date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).reduce((sum, c) => sum + c.amount, 0) || 0;

      return {
        totalContributions,
        totalLoans,
        activeLoans,
        monthlyContributions,
        netWorth: totalContributions - totalLoans,
        growthRate: 8.2 // This would be calculated based on historical data
      };
    },
    enabled: !!chamaId && !!user,
  });

  // Fetch pending approvals
  const pendingApprovalsQuery = useQuery({
    queryKey: ['admin-pending-approvals', chamaId],
    queryFn: async () => {
      console.log('Fetching pending approvals for chama:', chamaId);

      // Mock data for demo purposes
      return [
        {
          id: '1',
          amount: 50000,
          purpose: 'Business expansion',
          status: 'pending',
          created_at: new Date().toISOString(),
          chama_members: {
            profiles: { full_name: 'Jane Smith', email: 'jane@example.com' }
          }
        }
      ];
    },
    enabled: !!chamaId && !!user,
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description: string }) => {
      console.log('Processing payment:', { amount, description });

      // Mock success for demo purposes
      console.log('Would process payment:', {
        p_chama_id: chamaId,
        p_amount: amount,
        p_description: description,
        p_payment_method: 'internal_transfer'
      });
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-wallet-transactions', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities', chamaId] });
      toast({
        title: "Payment Processed",
        description: "Payment has been successfully processed",
      });
    },
    onError: (error: any) => {
      console.error('Payment processing failed:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    },
  });

  // Record deposit mutation
  const recordDepositMutation = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description: string }) => {
      console.log('Recording deposit:', { amount, description });

      // Mock success for demo purposes
      console.log('Would record deposit:', {
        p_chama_id: chamaId,
        p_amount: amount,
        p_description: description,
        p_payment_method: 'manual_entry'
      });
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-wallet-transactions', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['admin-financial-metrics', chamaId] });
      toast({
        title: "Deposit Recorded",
        description: "Deposit has been successfully recorded",
      });
    },
    onError: (error: any) => {
      console.error('Deposit recording failed:', error);
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to record deposit",
        variant: "destructive",
      });
    },
  });

  // Approve loan mutation
  const approveLoanMutation = useMutation({
    mutationFn: async (loanRequestId: string) => {
      console.log('Approving loan request:', loanRequestId);

      // Mock success for demo purposes
      console.log('Would approve loan:', {
        loanRequestId,
        status: 'approved',
        approved_by: user?.id,
        approved_at: new Date().toISOString()
      });
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-approvals', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities', chamaId] });
      toast({
        title: "Loan Approved",
        description: "Loan request has been approved",
      });
    },
    onError: (error: any) => {
      console.error('Loan approval failed:', error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve loan",
        variant: "destructive",
      });
    },
  });

  // Reject loan mutation
  const rejectLoanMutation = useMutation({
    mutationFn: async (loanRequestId: string) => {
      console.log('Rejecting loan request:', loanRequestId);

      // Mock success for demo purposes
      console.log('Would reject loan:', {
        loanRequestId,
        status: 'rejected',
        approved_by: user?.id,
        approved_at: new Date().toISOString()
      });
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-approvals', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities', chamaId] });
      toast({
        title: "Loan Rejected",
        description: "Loan request has been rejected",
      });
    },
    onError: (error: any) => {
      console.error('Loan rejection failed:', error);
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject loan",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    activities: activitiesQuery.data || [],
    walletTransactions: walletTransactionsQuery.data || [],
    memberStats: memberStatsQuery.data || [],
    financialMetrics: financialMetricsQuery.data || {},
    pendingApprovals: pendingApprovalsQuery.data || [],
    
    // Loading states
    isLoading: activitiesQuery.isLoading || walletTransactionsQuery.isLoading || 
               memberStatsQuery.isLoading || financialMetricsQuery.isLoading ||
               pendingApprovalsQuery.isLoading,
    
    // Mutations
    processPayment: processPaymentMutation.mutateAsync,
    recordDeposit: recordDepositMutation.mutateAsync,
    approveLoan: approveLoanMutation.mutateAsync,
    rejectLoan: rejectLoanMutation.mutateAsync,
    
    // Mutation states
    isProcessingPayment: processPaymentMutation.isPending,
    isRecordingDeposit: recordDepositMutation.isPending,
    isApprovingLoan: approveLoanMutation.isPending,
    isRejectingLoan: rejectLoanMutation.isPending,
  };
};
