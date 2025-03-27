
import React, { useState, useEffect } from 'react';
import { VoiceRoom, VoiceParticipant } from '@/types';
import { cn } from "@/lib/utils";
import { ArrowLeft, Mic, MicOff, Hand, MoreHorizontal, Users, Video, VideoOff, Settings, Headphones } from 'lucide-react';
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [noiseSuppressionEnabled, setNoiseSuppressionEnabled] = useState(true);
  const [echoCancellationEnabled, setEchoCancellationEnabled] = useState(true);
  
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
  
  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      description: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
    });
  };
  
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      description: isRecording ? "Recording stopped" : "Recording started",
    });
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
        
        <Sheet>
          <SheetTrigger asChild>
            <button className="ml-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <Settings size={20} />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Voice Settings</SheetTitle>
              <SheetDescription>
                Adjust your audio settings
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Noise Suppression</Label>
                  <p className="text-xs text-muted-foreground">
                    Reduce background noise in your microphone
                  </p>
                </div>
                <Switch 
                  checked={noiseSuppressionEnabled} 
                  onCheckedChange={setNoiseSuppressionEnabled} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Echo Cancellation</Label>
                  <p className="text-xs text-muted-foreground">
                    Remove echo from your audio
                  </p>
                </div>
                <Switch 
                  checked={echoCancellationEnabled} 
                  onCheckedChange={setEchoCancellationEnabled} 
                />
              </div>
              
              {isHost && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Record Conversation</Label>
                    <p className="text-xs text-muted-foreground">
                      Save this voice room conversation
                    </p>
                  </div>
                  <Switch 
                    checked={isRecording} 
                    onCheckedChange={handleToggleRecording} 
                  />
                </div>
              )}
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
            {isHost && (
              <DropdownMenuItem onClick={() => {
                toast({
                  description: "Invite link copied to clipboard!",
                });
              }}>
                Copy Invite Link
              </DropdownMenuItem>
            )}
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
        
        {isScreenSharing && (
          <div className="mt-6 p-4 rounded-lg border bg-muted/30 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Screen sharing active</p>
              <button 
                onClick={handleToggleScreenShare}
                className="text-sm text-primary hover:underline"
              >
                Stop sharing
              </button>
            </div>
          </div>
        )}
        
        {isRecording && (
          <div className="mt-4 flex items-center justify-center">
            <div className="px-3 py-1 rounded-full bg-red-100 text-red-600 flex items-center text-xs">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></span>
              Recording
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
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          {isSpeaker && (
            <button
              onClick={handleToggleScreenShare}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                isScreenSharing 
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
              title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
            >
              {isScreenSharing ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          )}
          
          {!isSpeaker && (
            <button
              onClick={handleRaiseHand}
              className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80"
              title="Raise Hand"
            >
              <Hand size={20} />
            </button>
          )}
          
          <button
            onClick={handleLeaveRoom}
            className="w-12 h-12 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/80"
            title="Leave"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceRoomView;
