
import React from 'react';
import { VoiceRoom } from '@/types';
import { cn } from "@/lib/utils";
import Avatar from './Avatar';
import { Mic, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VoiceRoomCardProps {
  room: VoiceRoom;
  className?: string;
}

const VoiceRoomCard: React.FC<VoiceRoomCardProps> = ({ 
  room,
  className 
}) => {
  const navigate = useNavigate();
  
  // Calculate the number of speakers
  const speakerCount = room.participants.filter(p => 
    p.role === 'host' || p.role === 'speaker'
  ).length;
  
  return (
    <div 
      className={cn(
        "p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      onClick={() => navigate(`/voice-rooms/${room.id}`)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {room.isLive && (
            <span className="flex items-center mr-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></span>
              <span className="text-xs font-medium text-red-500">LIVE</span>
            </span>
          )}
          <h3 className="font-medium line-clamp-1">{room.name}</h3>
        </div>
      </div>
      
      {room.topic && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {room.topic}
        </p>
      )}
      
      <div className="flex flex-wrap gap-1 mb-3">
        {room.participants.slice(0, 3).map((participant) => (
          <Avatar 
            key={participant.user.id} 
            user={participant.user} 
            size="sm" 
          />
        ))}
        
        {room.participants.length > 3 && (
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs">
            +{room.participants.length - 3}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <Mic size={14} className="mr-1" />
          <span>{speakerCount} speaker{speakerCount !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex items-center">
          <Users size={14} className="mr-1" />
          <span>{room.participants.length} listener{room.participants.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceRoomCard;
