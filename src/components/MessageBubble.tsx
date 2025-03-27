
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Message, Reaction } from '@/types';
import Avatar from './Avatar';
import MediaPreview from './MediaPreview';
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, Smile } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn,
  showAvatar = true,
  className
}) => {
  const formattedTime = format(message.timestamp, 'h:mm a');
  const [showReactions, setShowReactions] = useState(false);
  
  // Mock current user ID
  const currentUserId = 'user-1';
  
  // Common emoji reactions
  const commonEmojis = ['👍', '❤️', '🔥', '😂', '😮', '👏'];
  
  const handleVote = (voteType: 'up' | 'down') => {
    // In a real app, this would call an API
    console.log(`Voted ${voteType} on message ${message.id}`);
  };
  
  const addReaction = (emoji: string) => {
    // In a real app, this would call an API
    console.log(`Added reaction ${emoji} to message ${message.id}`);
    setShowReactions(false);
  };
  
  // Check if user already reacted with an emoji
  const hasReacted = (emoji: string) => {
    return message.reactions?.some(r => 
      r.emoji === emoji && r.users.includes(currentUserId)
    ) || false;
  };

  return (
    <div className={cn(
      "flex items-end gap-2 max-w-[85%] mb-4 animate-slide-in",
      isOwn ? "ml-auto" : "mr-auto",
      className
    )}>
      {!isOwn && showAvatar && (
        <Avatar user={message.sender} size="sm" className="mb-1" />
      )}
      
      <div className={cn("flex flex-col relative")}>
        {/* Message bubble */}
        <div className={cn(
          "rounded-2xl px-4 py-2.5 shadow-sm",
          isOwn ? 
            "bg-primary text-primary-foreground rounded-tr-sm" : 
            "bg-secondary text-secondary-foreground rounded-tl-sm"
        )}>
          {message.text}
          
          {message.media && message.media.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.media.map((media, index) => (
                <MediaPreview key={index} media={media} />
              ))}
            </div>
          )}
        </div>
        
        {/* Message reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={cn(
            "flex flex-wrap gap-1 mt-1",
            isOwn ? "justify-end" : "justify-start"
          )}>
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => addReaction(reaction.emoji)}
                className={cn(
                  "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs",
                  hasReacted(reaction.emoji) 
                    ? "bg-secondary" 
                    : "bg-background border"
                )}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Voting buttons - outside the bubble */}
        {message.votes && (
          <div className={cn(
            "flex items-center gap-1 absolute -left-8 top-1/2 -translate-y-1/2",
            isOwn && "hidden"
          )}>
            <button 
              onClick={() => handleVote('up')}
              className={cn(
                "flex flex-col items-center justify-center w-6 h-6 rounded-md hover:bg-secondary/80",
                message.votes.userVote === 'up' && "text-primary"
              )}
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => handleVote('down')}
              className={cn(
                "flex flex-col items-center justify-center w-6 h-6 rounded-md hover:bg-secondary/80",
                message.votes.userVote === 'down' && "text-destructive"
              )}
            >
              <ChevronDown size={14} />
            </button>
          </div>
        )}
        
        {/* Add reaction button - on hover */}
        <div className={cn(
          "relative",
          isOwn ? "self-start" : "self-end"
        )}>
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={cn(
              "p-1 rounded-full absolute -top-10",
              isOwn ? "-left-8" : "-right-8",
              "opacity-0 group-hover:opacity-100 hover:bg-secondary/80 transition-opacity"
            )}
          >
            <Smile size={16} />
          </button>
          
          {showReactions && (
            <div className={cn(
              "absolute z-10 p-1.5 bg-popover rounded-lg border shadow-md flex gap-1",
              isOwn ? "-left-24 -top-12" : "-right-24 -top-12"
            )}>
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addReaction(emoji)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-secondary rounded-md"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <span className={cn(
          "text-xs text-muted-foreground mt-1",
          isOwn ? "text-right" : "text-left"
        )}>
          {formattedTime}
          {isOwn && (
            <span className="ml-1.5">
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </span>
      </div>
      
      {isOwn && showAvatar && (
        <Avatar user={message.sender} size="sm" className="mb-1" />
      )}
    </div>
  );
};

export default MessageBubble;
