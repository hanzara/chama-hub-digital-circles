import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Users, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useGroupChat } from '@/hooks/useGroupChat';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface GroupChatProps {
  chamaData: any;
}

const GroupChat: React.FC<GroupChatProps> = ({ chamaData }) => {
  const { user } = useAuth();
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    connectionStatus, 
    sendTypingIndicator,
    currentMessage,
    setCurrentMessage,
    isSending
  } = useGroupChat(chamaData.id);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getSenderDisplayName = (message: any) => {
    return message.sender_name || 'Unknown User';
  };

  const isMyMessage = (message: any) => {
    return message.sender_name === user?.email;
  };

  const getConnectionStatusIcon = () => {
    if (connectionStatus === 'connected') {
      return <Wifi className="h-4 w-4 text-green-600" />;
    }
    return <WifiOff className="h-4 w-4 text-red-600" />;
  };

  const getConnectionStatusText = () => {
    return connectionStatus === 'connected' ? 'Connected' : 'Disconnected';
  };

  const getConnectionStatusColor = () => {
    return connectionStatus === 'connected' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <Card className="border-0 shadow-lg h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <CardTitle className="text-lg">Group Chat</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {getConnectionStatusIcon()}
            <Badge className={getConnectionStatusColor()}>
              {getConnectionStatusText()}
            </Badge>
          </div>
        </div>
        <CardDescription>
          Chat with other {chamaData.name} members
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4 py-2">
          <div className="space-y-4 min-h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading messages...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Users className="h-12 w-12 mb-4 opacity-50" />
                <div className="text-center">
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isFirst = index === 0 || messages[index - 1].sender_name !== message.sender_name;
                  const isLast = index === messages.length - 1 || messages[index + 1].sender_name !== message.sender_name;
                  const senderName = message.sender_name || 'Anonymous';
                  const isCurrentUser = message.sender_name === user?.email;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex max-w-[70%] ${
                          isMyMessage(message) ? 'flex-row-reverse' : 'flex-row'
                        } space-x-3`}
                      >
                        {isFirst && !isMyMessage(message) && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-xs">
                              {senderName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`flex flex-col ${isMyMessage(message) ? 'items-end' : 'items-start'}`}>
                          {isFirst && (
                            <div className={`flex items-center space-x-2 mb-1 ${
                              isMyMessage(message) ? 'flex-row-reverse space-x-reverse' : ''
                            }`}>
                              <span className="text-xs font-medium text-muted-foreground">
                                {isMyMessage(message) ? 'You' : senderName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(message.sent_at), { addSuffix: true })}
                              </span>
                            </div>
                          )}
                          
                          <div
                            className={`rounded-lg px-3 py-2 max-w-full break-words ${
                              isMyMessage(message)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            } ${isFirst ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isSending}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              size="icon"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupChat;