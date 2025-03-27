
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Camera, ChevronUp, ChevronDown, Smile, Upload } from 'lucide-react';
import { VideoPost, User } from '@/types';
import Avatar from './Avatar';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

interface VideoChannelViewProps {
  channelId: string;
  channelName: string;
}

const VideoChannelView: React.FC<VideoChannelViewProps> = ({ 
  channelId, 
  channelName 
}) => {
  // Mock current user
  const currentUser: User = {
    id: 'user-1',
    name: 'Current User',
    avatar: '/placeholder.svg',
    status: 'online'
  };
  
  // Mock video posts
  const [videos, setVideos] = useState<VideoPost[]>([
    {
      id: 'video-1',
      title: 'Awesome gameplay',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      createdAt: new Date(),
      creator: {
        id: 'user-2',
        name: 'Jane Doe',
        avatar: '/placeholder.svg'
      },
      reactions: [
        { emoji: '👍', count: 5, users: ['user-3', 'user-4'] },
        { emoji: '❤️', count: 3, users: ['user-5'] }
      ],
      votes: {
        upvotes: 12,
        downvotes: 2,
        userVote: null
      }
    },
    {
      id: 'video-2',
      title: 'Tutorial video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      createdAt: new Date(Date.now() - 86400000),
      creator: {
        id: 'user-3',
        name: 'John Smith',
        avatar: '/placeholder.svg'
      },
      reactions: [
        { emoji: '🔥', count: 7, users: ['user-1'] },
      ],
      votes: {
        upvotes: 8,
        downvotes: 1,
        userVote: 'up'
      }
    }
  ]);
  
  const [isRecording, setIsRecording] = useState(false);
  
  const handleVote = (videoId: string, voteType: 'up' | 'down') => {
    setVideos(prev => prev.map(video => {
      if (video.id === videoId) {
        const currentVote = video.votes?.userVote;
        let upvotes = video.votes?.upvotes || 0;
        let downvotes = video.votes?.downvotes || 0;
        
        // Remove previous vote if exists
        if (currentVote === 'up') upvotes--;
        if (currentVote === 'down') downvotes--;
        
        // Add new vote unless user is toggling off their vote
        let newVote: 'up' | 'down' | null = null;
        if (currentVote !== voteType) {
          newVote = voteType;
          if (voteType === 'up') upvotes++;
          if (voteType === 'down') downvotes++;
        }
        
        return {
          ...video,
          votes: {
            upvotes,
            downvotes,
            userVote: newVote
          }
        };
      }
      return video;
    }));
  };
  
  const toggleReaction = (videoId: string, emoji: string) => {
    setVideos(prev => prev.map(video => {
      if (video.id === videoId) {
        const reactions = [...(video.reactions || [])];
        const existingIndex = reactions.findIndex(r => r.emoji === emoji);
        
        if (existingIndex >= 0) {
          // Check if user already reacted
          const hasReacted = reactions[existingIndex].users.includes(currentUser.id);
          
          if (hasReacted) {
            // Remove user's reaction
            reactions[existingIndex] = {
              ...reactions[existingIndex],
              count: reactions[existingIndex].count - 1,
              users: reactions[existingIndex].users.filter(id => id !== currentUser.id)
            };
            
            // Remove reaction if count is 0
            if (reactions[existingIndex].count === 0) {
              reactions.splice(existingIndex, 1);
            }
          } else {
            // Add user's reaction
            reactions[existingIndex] = {
              ...reactions[existingIndex],
              count: reactions[existingIndex].count + 1,
              users: [...reactions[existingIndex].users, currentUser.id]
            };
          }
        } else {
          // Add new reaction
          reactions.push({
            emoji,
            count: 1,
            users: [currentUser.id]
          });
        }
        
        return {
          ...video,
          reactions
        };
      }
      return video;
    }));
  };
  
  const startRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "Your screen recording has begun. Click Stop when finished."
    });
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped",
      description: "Your video has been saved. You can now post it."
    });
  };
  
  const handleUpload = () => {
    toast({
      title: "Upload video",
      description: "This would open a file picker to upload your video."
    });
  };
  
  // Common emoji reactions
  const commonEmojis = ['👍', '❤️', '🔥', '😂', '🎮', '👏'];
  
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold">#{channelName}</h1>
        <p className="text-sm text-muted-foreground">Share video clips with the community</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {videos.map(video => (
          <div 
            key={video.id} 
            className="bg-card rounded-lg border shadow-sm overflow-hidden"
          >
            <div className="flex items-center p-4 border-b">
              <Avatar user={video.creator} size="sm" />
              <div className="ml-3">
                <p className="font-medium">{video.creator.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {video.title && (
              <div className="p-4 pb-0">
                <h3 className="font-medium">{video.title}</h3>
              </div>
            )}
            
            <div className="p-4 aspect-video">
              <video 
                src={video.url} 
                poster={video.thumbnailUrl}
                controls
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <button
                    onClick={() => handleVote(video.id, 'up')}
                    className={cn(
                      "flex items-center gap-1 p-1.5 rounded-md",
                      video.votes?.userVote === 'up' 
                        ? "text-primary bg-primary/10" 
                        : "hover:bg-secondary"
                    )}
                  >
                    <ChevronUp size={16} />
                    <span className="text-sm">{video.votes?.upvotes || 0}</span>
                  </button>
                  
                  <button
                    onClick={() => handleVote(video.id, 'down')}
                    className={cn(
                      "flex items-center gap-1 p-1.5 rounded-md",
                      video.votes?.userVote === 'down' 
                        ? "text-destructive bg-destructive/10" 
                        : "hover:bg-secondary"
                    )}
                  >
                    <ChevronDown size={16} />
                    <span className="text-sm">{video.votes?.downvotes || 0}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-1">
                  {video.reactions?.map(reaction => (
                    <button
                      key={reaction.emoji}
                      onClick={() => toggleReaction(video.id, reaction.emoji)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-md text-sm",
                        reaction.users.includes(currentUser.id) 
                          ? "bg-secondary" 
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <span>{reaction.emoji}</span>
                      <span>{reaction.count}</span>
                    </button>
                  ))}
                  
                  <div className="relative group">
                    <button className="flex items-center p-1.5 rounded-md hover:bg-secondary">
                      <Smile size={16} />
                    </button>
                    
                    <div className="absolute bottom-full mb-2 p-2 bg-popover rounded-lg border shadow-md hidden group-hover:flex flex-wrap gap-1 z-10">
                      {commonEmojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => toggleReaction(video.id, emoji)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-md"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t p-4 flex gap-3">
        {isRecording ? (
          <Button 
            onClick={stopRecording}
            variant="destructive"
          >
            Stop Recording
          </Button>
        ) : (
          <Button 
            onClick={startRecording}
            variant="secondary"
          >
            <Camera size={18} className="mr-1.5" />
            Record
          </Button>
        )}
        
        <Button
          onClick={handleUpload}
          variant="outline"
        >
          <Upload size={18} className="mr-1.5" />
          Upload
        </Button>
      </div>
    </div>
  );
};

export default VideoChannelView;
