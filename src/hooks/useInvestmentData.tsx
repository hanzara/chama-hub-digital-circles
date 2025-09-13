import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useInvestmentData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['investment-data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching investment data for user:', user.id);

      // Mock investments for demo purposes
      const investments = [
        {
          id: '1',
          amount_invested: 50000,
          shares_percentage: 5.2,
          returns_earned: 12500,
          last_return_date: new Date().toISOString(),
          exit_date: null,
          status: 'active',
          created_at: new Date().toISOString(),
          investment_projects: {
            id: '1',
            title: 'Real Estate Fund',
            category: 'Real Estate',
            projected_roi: 15.5,
            risk_level: 'medium',
            status: 'active'
          }
        }
      ];

      // Calculate totals
      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount_invested, 0);
      const totalReturns = investments.reduce((sum, inv) => sum + inv.returns_earned, 0);
      const activeInvestments = investments.filter(inv => inv.status === 'active').length;

      // Mock performance data
      const performanceData = [
        { month: 'Jan', portfolio: 45000, returns: 2500 },
        { month: 'Feb', portfolio: 48000, returns: 3800 },
        { month: 'Mar', portfolio: 52000, returns: 5200 },
        { month: 'Apr', portfolio: 55000, returns: 7500 },
        { month: 'May', portfolio: 58000, returns: 9800 },
        { month: 'Jun', portfolio: 62500, returns: 12500 }
      ];

      // Mock recent activities
      const recentActivities = [
        {
          type: 'investment',
          description: 'Invested in Real Estate Fund',
          amount: 50000,
          date: new Date().toISOString()
        },
        {
          type: 'return',
          description: 'Received quarterly returns',
          amount: 3125,
          date: new Date().toISOString()
        }
      ];

      return {
        investments,
        totalInvested,
        totalReturns,
        activeInvestments,
        performanceData,
        recentActivities,
        roi: totalInvested > 0 ? (totalReturns / totalInvested * 100) : 0
      };
    },
    enabled: !!user,
  });
};

export const useInvestmentActions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const investMutation = useMutation({
    mutationFn: async ({ projectId, amount }: { projectId: string; amount: number }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Making investment:', { projectId, amount });
      
      // Mock success for demo purposes
      return { success: true, investmentId: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-data'] });
      toast({
        title: "Investment Successful! 🎉",
        description: "Your investment has been processed successfully",
      });
    },
    onError: (error: any) => {
      console.error('Investment failed:', error);
      toast({
        title: "Investment Failed",
        description: error.message || "Failed to process investment",
        variant: "destructive",
      });
    },
  });

  const exitMutation = useMutation({
    mutationFn: async ({ investmentId }: { investmentId: string }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Exiting investment:', investmentId);
      
      // Mock success for demo purposes
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-data'] });
      toast({
        title: "Exit Successful! ✅",
        description: "Your investment exit has been processed",
      });
    },
    onError: (error: any) => {
      console.error('Exit failed:', error);
      toast({
        title: "Exit Failed",
        description: error.message || "Failed to exit investment",
        variant: "destructive",
      });
    },
  });

  return {
    invest: investMutation.mutate,
    isInvesting: investMutation.isPending,
    exit: exitMutation.mutate,
    isExiting: exitMutation.isPending,
  };
};