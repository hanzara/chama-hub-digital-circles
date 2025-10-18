import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { Loader2, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const joinSchema = z.object({
  full_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  phone_number: z.string().trim().min(10, 'Phone number must be at least 10 digits').max(15),
});

const JoinChamaPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [chamaName, setChamaName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setInvitationToken(token);
      // Fetch chama details from invitation
      fetchChamaDetails(token);
    } else {
      navigate('/');
    }
  }, [searchParams, navigate]);

  const fetchChamaDetails = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('member_invitations')
        .select('chama_id, chamas(name)')
        .eq('invitation_token', token)
        .eq('status', 'pending')
        .single();

      if (error) throw error;
      if (data?.chamas) {
        setChamaName((data.chamas as any).name);
      }
    } catch (error) {
      console.error('Error fetching chama details:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form
    try {
      joinSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsLoading(true);

    try {
      // First, check if invitation is still valid
      const { data: invitation, error: inviteError } = await supabase
        .from('member_invitations')
        .select('id, chama_id, email, phone_number, status')
        .eq('invitation_token', invitationToken)
        .single();

      if (inviteError || !invitation) {
        throw new Error('Invalid or expired invitation');
      }

      if (invitation.status !== 'pending') {
        throw new Error('This invitation has already been used');
      }

      // Update the invitation with user details
      const { error: updateError } = await supabase
        .from('member_invitations')
        .update({
          email: formData.email,
          phone_number: formData.phone_number,
          status: 'pending_approval', // Changed from 'pending' to indicate form submitted
        })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      toast({
        title: 'Request Submitted!',
        description: 'Your request to join has been sent to the admin for approval. You\'ll be notified once approved.',
      });

      // Redirect to success page or home
      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      console.error('Error submitting join request:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit join request',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!invitationToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <CardTitle>Join {chamaName || 'Chama'}</CardTitle>
              <CardDescription>
                Fill in your details to request to join this savings group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                  {errors.full_name && (
                    <p className="text-sm text-destructive">{errors.full_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number *</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="0712345678"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    required
                  />
                  {errors.phone_number && (
                    <p className="text-sm text-destructive">{errors.phone_number}</p>
                  )}
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Request to Join'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  The admin will review your request and you'll be notified once approved
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default JoinChamaPage;
