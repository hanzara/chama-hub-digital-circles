import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

export const useMemberManagement = (chamaId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock fetch chama members
  const { data: members, isLoading } = useQuery<any[]>({
    queryKey: ['chama-members', chamaId],
    queryFn: async () => {
      console.log('Fetching members for chama:', chamaId);
      
      // Mock members data
      return [
        {
          id: '1',
          user_id: '1',
          role: 'admin',
          is_active: true,
          total_contributed: 125000,
          joined_at: new Date().toISOString(),
          profiles: {
            user_id: '1',
            full_name: 'John Doe',
            email: 'john@example.com',
            phone_number: '+254712345678'
          }
        },
        {
          id: '2',
          user_id: '2',
          role: 'member',
          is_active: true,
          total_contributed: 85000,
          joined_at: new Date().toISOString(),
          profiles: {
            user_id: '2',
            full_name: 'Jane Smith',
            email: 'jane@example.com',
            phone_number: '+254723456789'
          }
        }
      ];
    },
  });

  // Update member role mutation
  const updateMemberRoleMutation = useMutation({
    mutationFn: async ({ memberId, newRole }: { memberId: string; newRole: string }) => {
      console.log('=== Updating Member Role ===');
      console.log('Member ID:', memberId);
      console.log('New Role:', newRole);

      // Mock success for demo purposes
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Role Updated! ✅",
        description: "Member role has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['chama-members', chamaId] });
    },
    onError: (error: any) => {
      console.error('Error updating member role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member role",
        variant: "destructive",
      });
    },
  });

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    mutationFn: async ({ email, role = 'member' }: { email: string; role?: string }) => {
      console.log('=== Inviting Member ===');
      console.log('Email:', email);
      console.log('Role:', role);

      // Mock success for demo purposes
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Member Added! ✅",
        description: "Member has been added to the chama successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['chama-members', chamaId] });
      queryClient.invalidateQueries({ queryKey: ['chamas'] });
    },
    onError: (error: any) => {
      console.error('Error inviting member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    },
  });

  return {
    members,
    isLoading,
    updateMemberRole: updateMemberRoleMutation.mutate,
    isUpdatingRole: updateMemberRoleMutation.isPending,
    inviteMember: inviteMemberMutation.mutate,
    isInviting: inviteMemberMutation.isPending,
  };
};