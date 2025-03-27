
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import VoiceChannelSidebar from '@/components/VoiceChannelSidebar';
import VideoChannelView from '@/components/VideoChannelView';
import { useIsMobile } from '@/hooks/use-mobile';

const VideoChannelPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const isMobile = useIsMobile();
  
  // These are our supported video channels - in a real app, this would come from an API
  const validVideoChannels = ['clips', 'tutorials', 'gameplay'];
  
  // Get channel name based on ID
  const getChannelName = (id: string) => {
    if (validVideoChannels.includes(id)) {
      return id; // The ID is the same as the name for these channels
    }
    return null;
  };
  
  const channelName = channelId ? getChannelName(channelId) : null;
  
  // If channel doesn't exist, redirect to clips
  if (!channelName) {
    return <Navigate to="/video-channels/clips" />;
  }
  
  // Mobile: Show only video channel without sidebar
  if (isMobile) {
    return (
      <Layout>
        <VideoChannelView
          channelId={channelId}
          channelName={channelName}
        />
      </Layout>
    );
  }
  
  // Desktop: Show Discord-like sidebar with channel list
  return (
    <Layout
      sidebar={<VoiceChannelSidebar />}
    >
      <VideoChannelView
        channelId={channelId}
        channelName={channelName}
      />
    </Layout>
  );
};

export default VideoChannelPage;
