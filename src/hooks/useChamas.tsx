
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/lib/database.types';

type Chama = Database['public']['Tables']['chamas']['Row'];
type ChamaInsert = Database['public']['Tables']['chamas']['Insert'];

export const useChamas = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['chamas', user?.id],
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching chamas for user:', user.id);

      // Mock chamas for demo purposes
      const data = [
        {
          id: '1',
          name: 'Investment Club',
          description: 'Our community investment group',
          contribution_amount: 15000,
          contribution_frequency: 'monthly',
          max_members: 50,
          current_members: 25,
          total_savings: 2400000,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          chama_members: { role: 'admin', is_active: true }
        }
      ];
      
      console.log('Fetched chamas:', data);
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateChama = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chamaData: Omit<ChamaInsert, 'created_by'>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Creating chama with data:', chamaData);

      // Mock success for demo purposes
      console.log('Creating chama with data:', chamaData);
      
      const chama = {
        id: Date.now().toString(),
        name: chamaData.name,
        description: chamaData.description,
        contribution_amount: chamaData.contribution_amount,
        contribution_frequency: chamaData.contribution_frequency || 'monthly',
        max_members: chamaData.max_members || 50,
        created_by: user.id,
        current_members: 1,
        total_savings: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      };

      console.log('Chama created:', chama);
      return chama;
    },
    onSuccess: (data) => {
      console.log('Chama creation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['chamas'] });
      toast({
        title: "Success!",
        description: "Your chama has been created successfully. You are now the admin and can invite members and assign roles.",
      });
    },
    onError: (error: any) => {
      console.error('Chama creation failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create chama. Please try again.",
        variant: "destructive",
      });
    },
  });
};
