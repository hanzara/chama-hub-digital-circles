import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useLoanData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['loan-data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching loan data for user:', user.id);

      // Mock loans for demo purposes
      const loans = [
        {
          id: '1',
          amount: 50000,
          interest_rate: 12.5,
          status: 'active',
          created_at: new Date().toISOString(),
          disbursed_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
          remaining_balance: 45000,
          monthly_payment: 5000
        }
      ];

      // Mock repayments
      const repayments = [
        {
          id: '1',
          loan_id: '1',
          amount: 5000,
          payment_date: new Date().toISOString(),
          status: 'completed'
        }
      ];

      // Calculate totals
      const totalBorrowed = loans.reduce((sum, loan) => sum + loan.amount, 0);
      const totalRepaid = repayments.reduce((sum, repayment) => sum + repayment.amount, 0);
      const remainingBalance = loans.reduce((sum, loan) => sum + loan.remaining_balance, 0);
      const activeLoans = loans.filter(loan => loan.status === 'active').length;

      // Mock payment history for charts
      const paymentHistory = [
        { month: 'Jan', paid: 5000, due: 5000 },
        { month: 'Feb', paid: 5000, due: 5000 },
        { month: 'Mar', paid: 5000, due: 5000 },
        { month: 'Apr', paid: 0, due: 5000 },
        { month: 'May', paid: 5000, due: 5000 },
        { month: 'Jun', paid: 5000, due: 5000 }
      ];

      return {
        loans,
        repayments,
        totalBorrowed,
        totalRepaid,
        remainingBalance,
        activeLoans,
        paymentHistory,
        creditScore: 750 // Mock credit score
      };
    },
    enabled: !!user,
  });
};

export const useLoanActions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const repayLoanMutation = useMutation({
    mutationFn: async ({ loanId, amount }: { loanId: string; amount: number }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Making loan repayment:', { loanId, amount });
      
      // Mock success for demo purposes
      return { success: true, repaymentId: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-data'] });
      toast({
        title: "Repayment Successful! 💰",
        description: "Your loan repayment has been processed",
      });
    },
    onError: (error: any) => {
      console.error('Repayment failed:', error);
      toast({
        title: "Repayment Failed",
        description: error.message || "Failed to process repayment",
        variant: "destructive",
      });
    },
  });

  const applyForLoanMutation = useMutation({
    mutationFn: async ({ amount, purpose }: { amount: number; purpose: string }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Applying for loan:', { amount, purpose });
      
      // Mock success for demo purposes
      return { success: true, loanId: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-data'] });
      toast({
        title: "Loan Application Submitted! 📋",
        description: "Your loan application is under review",
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

  return {
    repayLoan: repayLoanMutation.mutate,
    isRepaying: repayLoanMutation.isPending,
    applyForLoan: applyForLoanMutation.mutate,
    isApplying: applyForLoanMutation.isPending,
  };
};