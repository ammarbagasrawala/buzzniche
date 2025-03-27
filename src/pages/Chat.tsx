
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ConversationList from '@/components/ConversationList';
import Conversation from '@/components/Conversation';
import { useConversation } from '@/contexts/ConversationContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Chat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const isMobile = useIsMobile();
  const { 
    conversations, 
    getConversation, 
    currentUser,
    loadingConversations,
    sendMessage
  } = useConversation();
  
  const selectedConversation = conversationId 
    ? getConversation(conversationId)
    : undefined;
  
  // Loading state
  if (loadingConversations) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Mobile: Show only conversation if one is selected
  if (isMobile && selectedConversation) {
    return (
      <Layout>
        <Conversation
          conversation={selectedConversation}
          currentUserId={currentUser.id}
          onSend={(text) => sendMessage(selectedConversation.id, text)}
        />
      </Layout>
    );
  }
  
  // Mobile: Show only conversation list if none is selected
  if (isMobile) {
    return (
      <Layout>
        <ConversationList 
          conversations={conversations}
          activeConversationId={conversationId}
        />
      </Layout>
    );
  }
  
  // Desktop: Show both sidebar and conversation
  return (
    <Layout
      sidebar={
        <ConversationList 
          conversations={conversations}
          activeConversationId={conversationId}
        />
      }
    >
      {selectedConversation ? (
        <Conversation
          conversation={selectedConversation}
          currentUserId={currentUser.id}
          onSend={(text) => sendMessage(selectedConversation.id, text)}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-center p-4">
          <div className="max-w-md">
            <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
            <p className="text-muted-foreground">
              Choose a conversation from the list or start a new one
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Chat;
