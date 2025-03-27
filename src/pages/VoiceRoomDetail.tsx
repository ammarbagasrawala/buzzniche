
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useVoiceRoom } from '@/contexts/VoiceRoomContext';
import { useConversation } from '@/contexts/ConversationContext';
import VoiceRoomView from '@/components/VoiceRoomView';
import VoiceChannelSidebar from '@/components/VoiceChannelSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const VoiceRoomDetail = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { getRoom, joinRoom, leaveRoom, toggleMute, raiseHand, loadingRooms } = useVoiceRoom();
  const { currentUser } = useConversation();
  const isMobile = useIsMobile();
  
  const room = roomId ? getRoom(roomId) : undefined;
  
  useEffect(() => {
    // Join the room when component mounts
    if (roomId && room) {
      joinRoom(roomId);
    }
    
    // Leave the room when component unmounts
    return () => {
      leaveRoom();
    };
  }, [roomId, room]);
  
  // Loading state
  if (loadingRooms) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading voice room...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // If room doesn't exist, redirect to voice rooms list
  if (!room) {
    return <Navigate to="/voice-rooms" />;
  }
  
  // Mobile: Show only voice room without sidebar
  if (isMobile) {
    return (
      <Layout>
        <VoiceRoomView
          room={room}
          currentUserId={currentUser.id}
          onLeaveRoom={leaveRoom}
          onToggleMute={toggleMute}
          onRaiseHand={raiseHand}
        />
      </Layout>
    );
  }
  
  // Desktop: Show Discord-like sidebar with channel list
  return (
    <Layout
      sidebar={<VoiceChannelSidebar />}
    >
      <VoiceRoomView
        room={room}
        currentUserId={currentUser.id}
        onLeaveRoom={leaveRoom}
        onToggleMute={toggleMute}
        onRaiseHand={raiseHand}
      />
    </Layout>
  );
};

export default VoiceRoomDetail;
