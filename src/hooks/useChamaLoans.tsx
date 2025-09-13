import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useChamaLoans = (chamaId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch loan applications for the chama
  const loansQuery = useQuery({
    queryKey: ['chama-loans', chamaId],
    queryFn: async () => {
      console.log('Fetching loans for chama:', chamaId);

      // Mock data for demo purposes
      console.log('Fetched loans:', []);
      return [];
    },
    enabled: !!chamaId,
  });

  // Apply for a loan
  const applyForLoanMutation = useMutation({
    mutationFn: async ({ 
      amount, 
      purpose, 
      repaymentPeriodMonths,
      collateral 
    }: {
      amount: number;
      purpose: string;
      repaymentPeriodMonths: number;
      collateral?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Applying for loan:', { amount, purpose, repaymentPeriodMonths });

      // Mock success for demo purposes
      console.log('Would apply for loan:', { amount, purpose, repaymentPeriodMonths });
      return { success: true, id: '1' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chama-loans'] });
      toast({
        title: "Loan Application Submitted! 📋",
        description: "Your loan application has been submitted for review by administrators",
      });
    },
    onError: (error: any) => {
      console.error('Loan application failed:', error);
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit loan application",
        variant: "destructive",
      });
    },
  });

  // Approve loan (admin only)
  const approveLoanMutation = useMutation({
    mutationFn: async ({ loanId }: { loanId: string }) => {
      console.log('Approving loan:', loanId);

      // Mock success for demo purposes
      console.log('Would approve loan:', loanId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chama-loans'] });
      toast({
        title: "Loan Approved! ✅",
        description: "The loan application has been approved",
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

  // Reject loan (admin only)
  const rejectLoanMutation = useMutation({
    mutationFn: async ({ loanId, reason }: { loanId: string; reason: string }) => {
      console.log('Rejecting loan:', loanId, reason);

      // Mock success for demo purposes
      console.log('Would reject loan:', loanId, reason);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chama-loans'] });
      toast({
        title: "Loan Rejected",
        description: "The loan application has been rejected",
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
    loans: loansQuery.data || [],
    isLoading: loansQuery.isLoading,
    applyForLoan: applyForLoanMutation.mutate,
    isApplying: applyForLoanMutation.isPending,
    approveLoan: approveLoanMutation.mutate,
    isApproving: approveLoanMutation.isPending,
    rejectLoan: rejectLoanMutation.mutate,
    isRejecting: rejectLoanMutation.isPending,
  };
};