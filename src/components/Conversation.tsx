
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { Conversation as ConversationType, Message } from '@/types';
import Avatar from './Avatar';
import MessageBubble from './MessageBubble';
import { ArrowLeft, Paperclip, Mic, SendHorizontal, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConversationProps {
  conversation: ConversationType;
  currentUserId: string;
  className?: string;
  onSend: (text: string) => void;
  onBack?: () => void;
}

const Conversation: React.FC<ConversationProps> = ({ 
  conversation, 
  currentUserId,
  className,
  onSend,
  onBack
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const goBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };
  
  // For group conversations, use group name or create one from participants
  const otherParticipants = conversation.participants.filter(
    p => p.id !== currentUserId
  );
  
  const displayName = conversation.isGroup
    ? (conversation.name || otherParticipants.slice(0, 3).map(p => p.name.split(' ')[0]).join(', '))
    : otherParticipants[0]?.name || 'Chat';
    
  // Determine which avatar to show
  const avatarUser = conversation.isGroup 
    ? otherParticipants[0] 
    : otherParticipants[0];

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-background/80 backdrop-blur-sm">
        <button 
          onClick={goBack}
          className="mr-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        
        <Avatar user={avatarUser} showStatus={!conversation.isGroup} />
        
        <div className="ml-3 flex-1">
          <h2 className="font-medium">{displayName}</h2>
          <p className="text-xs text-muted-foreground">
            {conversation.isGroup 
              ? `${conversation.participants.length} participants` 
              : otherParticipants[0]?.status === 'online' 
                ? 'Online'
                : 'Offline'}
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
        <div className="space-y-1 py-2">
          {conversation.messages.map((message, index) => {
            const isOwn = message.sender.id === currentUserId;
            const showAvatar = index === 0 || 
              conversation.messages[index - 1].sender.id !== message.sender.id;
              
            return (
              <MessageBubble 
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground">
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative bg-secondary rounded-2xl overflow-hidden">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-transparent resize-none focus:outline-none"
              style={{ 
                minHeight: '46px',
                maxHeight: '120px'
              }}
            />
            
            <button 
              className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              onClick={handleSend}
            >
              <SendHorizontal size={16} />
            </button>
          </div>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground">
            <Mic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
