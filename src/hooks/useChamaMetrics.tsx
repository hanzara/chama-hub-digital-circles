
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useChamaMetrics = (chamaId: string) => {
  return useQuery({
    queryKey: ['chama-metrics', chamaId],
    queryFn: async () => {
      console.log('Fetching chama metrics for:', chamaId);

      // Mock metrics for demo purposes
      const data = {
        net_worth: 2400000,
        upcoming_contributions_count: 12,
        pending_votes_count: 3,
        average_repayment_performance: 92.3,
        roi_percentage: 8.5
      };
      
      console.log('Fetched chama metrics:', data);
      return data;
    },
    enabled: !!chamaId,
  });
};
