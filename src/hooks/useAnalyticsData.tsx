
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export const useAnalyticsData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['analytics-data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching analytics data for user:', user.id);

      // Mock data for demo purposes
      const chamaMembers = [
        {
          chama_id: '1',
          total_contributed: 125000,
          last_contribution_date: new Date().toISOString(),
          chamas: {
            id: '1',
            name: 'Investment Club',
            total_savings: 2400000,
            current_members: 25
          }
        }
      ];

      const contributions = [
        { amount: 15000, contribution_date: '2024-01-01', chama_id: '1', chamas: { name: 'Investment Club' } },
        { amount: 15000, contribution_date: '2024-02-01', chama_id: '1', chamas: { name: 'Investment Club' } },
        { amount: 15000, contribution_date: '2024-03-01', chama_id: '1', chamas: { name: 'Investment Club' } }
      ];

      // Calculate total savings across all chamas
      const totalSavings = chamaMembers?.reduce((sum, member) => 
        sum + (member.total_contributed || 0), 0) || 0;

      // Calculate monthly growth (simplified with mock data)
      const monthlyGrowth = 8.2;

      // Mock contribution trends for chart
      const contributionTrends = [
        { month: 'Jan', amount: 15000 },
        { month: 'Feb', amount: 15000 },
        { month: 'Mar', amount: 15000 },
        { month: 'Apr', amount: 15000 },
        { month: 'May', amount: 15000 },
        { month: 'Jun', amount: 15000 }
      ];

      // Mock chama performance data
      const chamaPerformance = [
        {
          name: 'Investment Club',
          contributions: 125000,
          members: 25
        }
      ];

      // Mock recent activities
      const recentActivities = [
        {
          type: 'contribution',
          description: 'Contribution to Investment Club',
          amount: 15000,
          date: new Date().toISOString()
        }
      ];

      return {
        totalSavings,
        monthlyGrowth,
        activeChamasCount: chamaMembers?.length || 0,
        contributionTrends,
        chamaPerformance,
        recentActivities
      };
    },
    enabled: !!user,
  });
};
