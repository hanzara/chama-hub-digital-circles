import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ChatMessage {
  id: string;
  chama_id: string;
  sender_id: string;
  message: string;
  sent_at: string;
  sender_name: string;
  sender_avatar?: string;
}

export const useGroupChat = (chamaId: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock user profile
  const userProfile = {
    full_name: 'John Doe',
    avatar_url: ''
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      if (!user || !chamaId) throw new Error('Missing required data');

      console.log('=== Sending Message ===');
      console.log('User ID:', user.id);
      console.log('Chama ID:', chamaId);
      console.log('Message:', message);

      // Mock success for demo purposes
      return { success: true, id: Date.now().toString() };
    },
    onSuccess: () => {
      // Clear the message input
      setCurrentMessage('');

      toast({
        title: "Message Sent! 💬",
        description: "Your message has been sent to the group",
      });
    },
    onError: (error: any) => {
      console.error('Message sending failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    sendMessageMutation.mutate({ message: currentMessage.trim() });
  };

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    sendMessage,
    isLoading,
    isSending: sendMessageMutation.isPending,
    messagesEndRef,
    userProfile,
  };
};