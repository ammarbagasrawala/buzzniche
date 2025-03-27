
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import VoiceChannelSidebar from '@/components/VoiceChannelSidebar';
import TextChannelView from '@/components/TextChannelView';
import { useIsMobile } from '@/hooks/use-mobile';

const TextChannelPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const isMobile = useIsMobile();
  
  // These are our supported channels - in a real app, this would come from an API
  const validTextChannels = ['general', 'welcome', 'announcements'];
  
  // Get channel name based on ID
  const getChannelName = (id: string) => {
    if (validTextChannels.includes(id)) {
      return id; // The ID is the same as the name for these channels
    }
    return null;
  };
  
  const channelName = channelId ? getChannelName(channelId) : null;
  
  // If channel doesn't exist, redirect to general
  if (!channelName) {
    return <Navigate to="/text-channels/general" />;
  }
  
  // Mobile: Show only text channel without sidebar
  if (isMobile) {
    return (
      <Layout>
        <TextChannelView
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
      <TextChannelView
        channelId={channelId}
        channelName={channelName}
      />
    </Layout>
  );
};

export default TextChannelPage;
