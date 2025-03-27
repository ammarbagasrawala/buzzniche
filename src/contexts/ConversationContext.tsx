
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Conversation, User, Message } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ConversationContextType {
  conversations: Conversation[];
  currentUser: User;
  loadingConversations: boolean;
  getConversation: (id: string) => Conversation | undefined;
  sendMessage: (conversationId: string, text: string) => void;
}

const defaultUser: User = {
  id: 'current-user',
  name: 'You',
  avatar: '',
  status: 'online'
};

const defaultUsers: User[] = [
  {
    id: 'user1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online'
  },
  {
    id: 'user2',
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'away'
  },
  {
    id: 'user3',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'offline'
  },
  {
    id: 'user4',
    name: 'Emily Williams',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online'
  }
];

const generateMockMessages = (participants: User[], count = 5): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const sender = i % 2 === 0 ? participants[0] : participants[1];
    const hoursAgo = count - i;
    
    messages.push({
      id: uuidv4(),
      text: `This is message ${i + 1} in the conversation.`,
      sender,
      timestamp: new Date(now.getTime() - hoursAgo * 3600000),
      isRead: true
    });
  }
  
  return messages;
};

const generateMockConversations = (): Conversation[] => {
  const conversations: Conversation[] = [];
  
  // Direct conversations
  defaultUsers.forEach(user => {
    const participants = [defaultUser, user];
    const messages = generateMockMessages(participants);
    
    conversations.push({
      id: uuidv4(),
      participants,
      messages,
      unreadCount: 0,
      isGroup: false,
      lastMessage: messages[messages.length - 1],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  
  // Group conversation
  const groupParticipants = [defaultUser, ...defaultUsers.slice(0, 3)];
  const groupMessages = generateMockMessages(groupParticipants, 3);
  
  conversations.push({
    id: uuidv4(),
    participants: groupParticipants,
    messages: groupMessages,
    unreadCount: 2,
    isGroup: true,
    name: 'Project Team',
    lastMessage: groupMessages[groupMessages.length - 1],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return conversations;
};

export const ConversationContext = createContext<ConversationContextType>({
  conversations: [],
  currentUser: defaultUser,
  loadingConversations: true,
  getConversation: () => undefined,
  sendMessage: () => {}
});

export const useConversation = () => useContext(ConversationContext);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setConversations(generateMockConversations());
      setLoadingConversations(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getConversation = (id: string) => {
    return conversations.find(conv => conv.id === id);
  };
  
  const sendMessage = (conversationId: string, text: string) => {
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === conversationId) {
          const newMessage: Message = {
            id: uuidv4(),
            text,
            sender: defaultUser,
            timestamp: new Date(),
            isRead: false
          };
          
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage,
            updatedAt: new Date()
          };
        }
        return conv;
      });
    });
  };
  
  return (
    <ConversationContext.Provider value={{
      conversations,
      currentUser: defaultUser,
      loadingConversations,
      getConversation,
      sendMessage
    }}>
      {children}
    </ConversationContext.Provider>
  );
};
