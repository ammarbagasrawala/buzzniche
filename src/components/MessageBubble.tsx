
import React from 'react';
import { cn } from "@/lib/utils";
import { Message } from '@/types';
import Avatar from './Avatar';
import MediaPreview from './MediaPreview';
import { format } from 'date-fns';

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

  return (
    <div className={cn(
      "flex items-end gap-2 max-w-[85%] mb-4 animate-slide-in",
      isOwn ? "ml-auto" : "mr-auto",
      className
    )}>
      {!isOwn && showAvatar && (
        <Avatar user={message.sender} size="sm" className="mb-1" />
      )}
      
      <div className={cn("flex flex-col")}>
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
