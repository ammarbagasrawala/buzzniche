
import React, { useState } from 'react';
import { Send, Plus, Paperclip, Smile } from 'lucide-react';
import { cn } from "@/lib/utils";
import Avatar from './Avatar';
import { User } from '@/types';

interface TextChannelViewProps {
  channelId: string;
  channelName: string;
  className?: string;
}

interface TextMessage {
  id: string;
  content: string;
  user: User;
  timestamp: Date;
  attachments?: { id: string; name: string; url: string; type: string }[];
}

const TextChannelView: React.FC<TextChannelViewProps> = ({ 
  channelId, 
  channelName,
  className 
}) => {
  const [messageInput, setMessageInput] = useState('');
  
  // Mock data for demonstration
  const mockMessages: TextMessage[] = [
    {
      id: '1',
      content: 'Hey everyone! Welcome to the general channel 👋',
      user: {
        id: 'user1',
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'online'
      },
      timestamp: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: '2',
      content: 'I just joined the voice room "Tech Talk", anyone interested in joining?',
      user: {
        id: 'user2',
        name: 'Sarah Miller',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'away'
      },
      timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: '3',
      content: 'Here are the notes from our last meeting 📝',
      user: {
        id: 'user3',
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'online'
      },
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      attachments: [
        {
          id: 'att1',
          name: 'meeting_notes.pdf',
          url: '#',
          type: 'pdf'
        }
      ]
    },
    {
      id: '4',
      content: 'Looking forward to our next community event!',
      user: {
        id: 'user4',
        name: 'Emily Williams',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'online'
      },
      timestamp: new Date(Date.now() - 900000) // 15 minutes ago
    }
  ];
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageInput.trim()) {
      // In a real app, this would send the message to a backend
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Group messages by date
  const groupedMessages: { [key: string]: TextMessage[] } = {};
  mockMessages.forEach(message => {
    const dateKey = formatDate(message.timestamp);
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });
  
  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="border-b p-4">
        <div className="flex items-center">
          <div className="font-bold text-lg">#{channelName}</div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome to the beginning of the #{channelName} channel
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center">
              <div className="h-[1px] flex-grow bg-border"></div>
              <span className="mx-2 text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-secondary">
                {date}
              </span>
              <div className="h-[1px] flex-grow bg-border"></div>
            </div>
            
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-x-3 group">
                <Avatar user={message.user} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-x-2">
                    <span className="font-medium">{message.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map(attachment => (
                        <div 
                          key={attachment.id}
                          className="flex items-center gap-x-2 p-2 rounded-md bg-secondary/50 w-fit"
                        >
                          <Paperclip size={16} className="text-muted-foreground" />
                          <span className="text-sm font-medium">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-x-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
          >
            <Plus size={20} />
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message #${channelName}`}
              className="w-full px-4 py-2 bg-secondary/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary pr-10"
            />
            
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Smile size={20} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TextChannelView;
