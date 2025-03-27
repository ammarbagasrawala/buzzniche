
import React from 'react';
import { cn } from "@/lib/utils";
import { Conversation } from '@/types';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { PlusCircle, Search } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  className?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  activeConversationId,
  className
}) => {
  const navigate = useNavigate();
  
  const handleSelectConversation = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Messages</h2>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-primary hover:bg-primary/5 transition-colors">
            <PlusCircle size={20} />
          </button>
        </div>
        
        <div className="relative">
          <input 
            type="text"
            placeholder="Search"
            className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto hide-scrollbar p-1">
        <div className="space-y-1 pt-1">
          {conversations.map((conversation, index) => {
            const isActive = conversation.id === activeConversationId;
            const lastMessage = conversation.lastMessage;
            const lastMessageTime = lastMessage?.timestamp 
              ? format(lastMessage.timestamp, 'h:mm a')
              : '';
            
            // For group conversations, use group name or create one from participants
            const displayName = conversation.isGroup
              ? (conversation.name || conversation.participants.slice(0, 3).map(p => p.name.split(' ')[0]).join(', '))
              : conversation.participants[0].name;
              
            // Determine which avatar to show
            const avatarUser = conversation.isGroup 
              ? conversation.participants[0] 
              : conversation.participants[0];
            
            return (
              <div 
                key={conversation.id}
                className={cn(
                  "flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300",
                  isActive 
                    ? "bg-primary/10" 
                    : "hover:bg-secondary/80"
                )}
                onClick={() => handleSelectConversation(conversation.id)}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <Avatar user={avatarUser} showStatus={!conversation.isGroup} />
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{displayName}</h3>
                    <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                      {lastMessageTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center mt-0.5">
                    <p className={cn(
                      "text-sm truncate",
                      lastMessage && !lastMessage.isRead 
                        ? "font-medium text-foreground" 
                        : "text-muted-foreground"
                    )}>
                      {lastMessage?.text || "No messages yet"}
                    </p>
                    
                    {conversation.unreadCount > 0 && (
                      <span className="ml-auto shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
