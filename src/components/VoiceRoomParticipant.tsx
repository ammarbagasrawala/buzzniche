
import React from 'react';
import { VoiceParticipant } from '@/types';
import { cn } from "@/lib/utils";
import Avatar from './Avatar';
import { Mic, MicOff, Headphones } from 'lucide-react';

interface VoiceRoomParticipantProps {
  participant: VoiceParticipant;
  isCurrentUser?: boolean;
  onMuteToggle?: (userId: string, muted: boolean) => void;
  onRoleChange?: (userId: string, role: 'speaker' | 'listener') => void;
  className?: string;
}

const VoiceRoomParticipant: React.FC<VoiceRoomParticipantProps> = ({ 
  participant,
  isCurrentUser = false,
  onMuteToggle,
  onRoleChange,
  className 
}) => {
  const { user, role, isMuted } = participant;
  
  const handleMuteToggle = () => {
    if (isCurrentUser || role === 'host') {
      onMuteToggle?.(user.id, !isMuted);
    }
  };
  
  const roleBadge = {
    host: 'bg-primary text-primary-foreground',
    speaker: 'bg-secondary text-secondary-foreground',
    listener: 'bg-muted text-muted-foreground'
  };
  
  const getStatusIndicator = () => {
    if (!user.status) return null;
    
    const statusColors = {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      offline: 'bg-gray-500'
    };
    
    return (
      <div className={cn(
        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
        statusColors[user.status]
      )} />
    );
  };
  
  const isListening = role === 'listener' && user.status === 'online';
  
  return (
    <div className={cn("flex flex-col items-center p-2", className)}>
      <div className="relative">
        <Avatar user={user} size="lg" />
        
        {getStatusIndicator()}
        
        {(role === 'host' || role === 'speaker') && (
          <button 
            onClick={handleMuteToggle}
            disabled={!isCurrentUser && role !== 'host'}
            className={cn(
              "absolute -bottom-2 right-0 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-xs",
              isMuted ? "bg-red-500 text-white" : "bg-green-500 text-white"
            )}
          >
            {isMuted ? <MicOff size={12} /> : <Mic size={12} />}
          </button>
        )}
        
        {isListening && (
          <div className="absolute -bottom-2 right-0 w-6 h-6 rounded-full border-2 border-background bg-blue-500 text-white flex items-center justify-center">
            <Headphones size={12} />
          </div>
        )}
      </div>
      
      <span className="mt-2 text-sm font-medium line-clamp-1 text-center">
        {user.name}
        {isCurrentUser && " (You)"}
      </span>
      
      <div className={cn(
        "mt-1 text-xs px-2 py-0.5 rounded-full",
        roleBadge[role]
      )}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </div>
    </div>
  );
};

export default VoiceRoomParticipant;
