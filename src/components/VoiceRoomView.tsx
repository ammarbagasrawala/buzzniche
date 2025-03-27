
import React, { useState, useEffect } from 'react';
import { VoiceRoom, VoiceParticipant } from '@/types';
import { cn } from "@/lib/utils";
import { ArrowLeft, Mic, MicOff, HandRaised, MoreHorizontal, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import VoiceRoomParticipant from './VoiceRoomParticipant';
import Avatar from './Avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VoiceRoomViewProps {
  room: VoiceRoom;
  currentUserId: string;
  onLeaveRoom: () => void;
  onToggleMute: (isMuted: boolean) => void;
  onRaiseHand: () => void;
  className?: string;
}

const VoiceRoomView: React.FC<VoiceRoomViewProps> = ({ 
  room,
  currentUserId,
  onLeaveRoom,
  onToggleMute,
  onRaiseHand,
  className 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(true);
  
  const currentUserParticipant = room.participants.find(p => p.user.id === currentUserId);
  const isHost = currentUserParticipant?.role === 'host';
  const isSpeaker = currentUserParticipant?.role === 'speaker' || isHost;
  
  const hosts = room.participants.filter(p => p.role === 'host');
  const speakers = room.participants.filter(p => p.role === 'speaker');
  const listeners = room.participants.filter(p => p.role === 'listener');
  
  const handleToggleMute = () => {
    if (!isSpeaker) {
      toast({
        description: "You need to be a speaker to unmute yourself",
      });
      return;
    }
    
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    onToggleMute(newMuteState);
  };
  
  const handleRaiseHand = () => {
    if (isSpeaker) return;
    
    onRaiseHand();
    toast({
      description: "You raised your hand to speak",
    });
  };
  
  const handleLeaveRoom = () => {
    onLeaveRoom();
    navigate('/voice-rooms');
  };
  
  // Simulate participants muted status (in a real app, this would come from a WebRTC or WebSocket connection)
  const participantMutedStatus = (participant: VoiceParticipant) => {
    if (participant.user.id === currentUserId) {
      return isMuted;
    }
    return participant.isMuted;
  };
  
  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="flex items-center p-4 border-b">
        <button 
          onClick={handleLeaveRoom}
          className="mr-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex-1">
          <div className="flex items-center">
            <h2 className="font-medium">{room.name}</h2>
            {room.isLive && (
              <span className="ml-2 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></span>
                <span className="text-xs font-medium text-red-500">LIVE</span>
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {room.participants.length} participants
          </p>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <Users size={20} />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Participants ({room.participants.length})</SheetTitle>
              <SheetDescription>
                People in this voice room
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Hosts ({hosts.length})</h3>
                <div className="space-y-2">
                  {hosts.map(participant => (
                    <div key={participant.user.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar user={participant.user} size="sm" />
                        <span className="ml-2">{participant.user.name}</span>
                      </div>
                      {participantMutedStatus(participant) ? <MicOff size={16} /> : <Mic size={16} />}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Speakers ({speakers.length})</h3>
                <div className="space-y-2">
                  {speakers.map(participant => (
                    <div key={participant.user.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar user={participant.user} size="sm" />
                        <span className="ml-2">{participant.user.name}</span>
                      </div>
                      {participantMutedStatus(participant) ? <MicOff size={16} /> : <Mic size={16} />}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Listeners ({listeners.length})</h3>
                <div className="space-y-2">
                  {listeners.map(participant => (
                    <div key={participant.user.id} className="flex items-center">
                      <Avatar user={participant.user} size="sm" />
                      <span className="ml-2">{participant.user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLeaveRoom}>
              Leave Room
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Hosts & Speakers</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {[...hosts, ...speakers].map(participant => (
              <VoiceRoomParticipant
                key={participant.user.id}
                participant={{
                  ...participant,
                  isMuted: participantMutedStatus(participant)
                }}
                isCurrentUser={participant.user.id === currentUserId}
              />
            ))}
          </div>
        </div>
        
        {listeners.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Listeners</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {listeners.map(participant => (
                <VoiceRoomParticipant
                  key={participant.user.id}
                  participant={participant}
                  isCurrentUser={participant.user.id === currentUserId}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleToggleMute}
            disabled={!isSpeaker}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              isMuted 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-green-500 text-white hover:bg-green-600",
              !isSpeaker && "opacity-50 cursor-not-allowed"
            )}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          {!isSpeaker && (
            <button
              onClick={handleRaiseHand}
              className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80"
            >
              <HandRaised size={20} />
            </button>
          )}
          
          <button
            onClick={handleLeaveRoom}
            className="w-12 h-12 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/80"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceRoomView;
