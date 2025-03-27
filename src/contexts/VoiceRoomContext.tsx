
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VoiceRoom, User, VoiceParticipant } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useConversation } from './ConversationContext';
import { useToast } from '@/components/ui/use-toast';

interface VoiceRoomContextType {
  voiceRooms: VoiceRoom[];
  activeRoomId: string | null;
  loadingRooms: boolean;
  getRoom: (id: string) => VoiceRoom | undefined;
  createRoom: (name: string, topic?: string) => VoiceRoom;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  toggleMute: (isMuted: boolean) => void;
  raiseHand: () => void;
}

const defaultContextValue: VoiceRoomContextType = {
  voiceRooms: [],
  activeRoomId: null,
  loadingRooms: true,
  getRoom: () => undefined,
  createRoom: () => ({} as VoiceRoom),
  joinRoom: () => {},
  leaveRoom: () => {},
  toggleMute: () => {},
  raiseHand: () => {}
};

export const VoiceRoomContext = createContext<VoiceRoomContextType>(defaultContextValue);

export const useVoiceRoom = () => useContext(VoiceRoomContext);

export const VoiceRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useConversation();
  const { toast } = useToast();
  const [voiceRooms, setVoiceRooms] = useState<VoiceRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  
  // Generate mock voice rooms data
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setVoiceRooms(generateMockVoiceRooms(currentUser));
      setLoadingRooms(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentUser]);
  
  const getRoom = (id: string) => {
    return voiceRooms.find(room => room.id === id);
  };
  
  const createRoom = (name: string, topic?: string) => {
    const newRoom: VoiceRoom = {
      id: uuidv4(),
      name,
      topic,
      host: currentUser,
      participants: [
        {
          user: currentUser,
          role: 'host',
          isMuted: true,
          joinedAt: new Date()
        }
      ],
      isLive: true,
      createdAt: new Date()
    };
    
    setVoiceRooms(prev => [...prev, newRoom]);
    setActiveRoomId(newRoom.id);
    
    toast({
      description: "Room created successfully!",
    });
    
    return newRoom;
  };
  
  const joinRoom = (roomId: string) => {
    setVoiceRooms(prev => {
      return prev.map(room => {
        if (room.id === roomId) {
          // Check if user is already in the room
          const isAlreadyJoined = room.participants.some(
            p => p.user.id === currentUser.id
          );
          
          if (isAlreadyJoined) {
            return room;
          }
          
          // Add user as a listener
          const newParticipant: VoiceParticipant = {
            user: currentUser,
            role: 'listener',
            isMuted: true,
            joinedAt: new Date()
          };
          
          return {
            ...room,
            participants: [...room.participants, newParticipant]
          };
        }
        return room;
      });
    });
    
    setActiveRoomId(roomId);
    toast({
      description: "You've joined the room!",
    });
  };
  
  const leaveRoom = () => {
    if (!activeRoomId) return;
    
    setVoiceRooms(prev => {
      return prev.map(room => {
        if (room.id === activeRoomId) {
          // Remove user from participants
          const updatedParticipants = room.participants.filter(
            p => p.user.id !== currentUser.id
          );
          
          // If host leaves and there are other participants, assign a new host
          let finalParticipants = updatedParticipants;
          if (
            room.participants.find(p => p.user.id === currentUser.id)?.role === 'host' &&
            updatedParticipants.length > 0
          ) {
            // Find the first speaker to promote to host
            const speakerIndex = updatedParticipants.findIndex(p => p.role === 'speaker');
            
            if (speakerIndex >= 0) {
              finalParticipants = [
                ...updatedParticipants.slice(0, speakerIndex),
                { ...updatedParticipants[speakerIndex], role: 'host' },
                ...updatedParticipants.slice(speakerIndex + 1)
              ];
            } else {
              // Promote first listener to host
              finalParticipants = [
                { ...updatedParticipants[0], role: 'host' },
                ...updatedParticipants.slice(1)
              ];
            }
          }
          
          return {
            ...room,
            participants: finalParticipants,
            // If no participants left, set room to inactive
            isLive: finalParticipants.length > 0
          };
        }
        return room;
      });
    });
    
    setActiveRoomId(null);
    toast({
      description: "You've left the room",
    });
  };
  
  const toggleMute = (isMuted: boolean) => {
    if (!activeRoomId) return;
    
    setVoiceRooms(prev => {
      return prev.map(room => {
        if (room.id === activeRoomId) {
          const updatedParticipants = room.participants.map(p => {
            if (p.user.id === currentUser.id) {
              return { ...p, isMuted };
            }
            return p;
          });
          
          return { ...room, participants: updatedParticipants };
        }
        return room;
      });
    });
  };
  
  const raiseHand = () => {
    if (!activeRoomId) return;
    
    // In a real app, this would send a request to the host to approve
    // For this demo, we'll automatically promote to speaker after a delay
    toast({
      description: "You raised your hand to speak. Waiting for host approval...",
    });
    
    setTimeout(() => {
      setVoiceRooms(prev => {
        return prev.map(room => {
          if (room.id === activeRoomId) {
            const updatedParticipants = room.participants.map(p => {
              if (p.user.id === currentUser.id) {
                return { ...p, role: 'speaker' };
              }
              return p;
            });
            
            return { ...room, participants: updatedParticipants };
          }
          return room;
        });
      });
      
      toast({
        description: "You're now a speaker!",
      });
    }, 2000);
  };
  
  return (
    <VoiceRoomContext.Provider value={{
      voiceRooms,
      activeRoomId,
      loadingRooms,
      getRoom,
      createRoom,
      joinRoom,
      leaveRoom,
      toggleMute,
      raiseHand
    }}>
      {children}
    </VoiceRoomContext.Provider>
  );
};

// Helper function to generate mock voice rooms
const generateMockVoiceRooms = (currentUser: User): VoiceRoom[] => {
  // Mock users
  const mockUsers = [
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
  
  // Generate 4 mock voice rooms
  return [
    {
      id: uuidv4(),
      name: 'Tech Talk: Future of AI',
      description: 'Discussion about the latest developments in artificial intelligence',
      topic: 'Exploring the latest advancements in AI and machine learning',
      host: mockUsers[0] as User,
      participants: [
        {
          user: mockUsers[0] as User,
          role: 'host',
          isMuted: false,
          joinedAt: new Date(Date.now() - 3600000)
        },
        {
          user: mockUsers[1] as User,
          role: 'speaker',
          isMuted: true,
          joinedAt: new Date(Date.now() - 3000000)
        },
        {
          user: mockUsers[2] as User,
          role: 'listener',
          isMuted: true,
          joinedAt: new Date(Date.now() - 1800000)
        }
      ],
      isLive: true,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: uuidv4(),
      name: 'Startup Founders Meetup',
      topic: 'Sharing experiences and challenges of starting a business',
      host: mockUsers[3] as User,
      participants: [
        {
          user: mockUsers[3] as User,
          role: 'host',
          isMuted: false,
          joinedAt: new Date(Date.now() - 7200000)
        },
        {
          user: mockUsers[0] as User,
          role: 'speaker',
          isMuted: false,
          joinedAt: new Date(Date.now() - 6000000)
        }
      ],
      isLive: true,
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      id: uuidv4(),
      name: 'Music Production Tips',
      description: 'Learn from music producers about creating tracks',
      topic: 'Home studio setup and mixing techniques',
      host: mockUsers[1] as User,
      participants: [
        {
          user: mockUsers[1] as User,
          role: 'host',
          isMuted: false,
          joinedAt: new Date(Date.now() - 10800000)
        },
        {
          user: mockUsers[2] as User,
          role: 'speaker',
          isMuted: true,
          joinedAt: new Date(Date.now() - 9000000)
        },
        {
          user: mockUsers[3] as User,
          role: 'listener',
          isMuted: true,
          joinedAt: new Date(Date.now() - 5400000)
        }
      ],
      isLive: true,
      createdAt: new Date(Date.now() - 10800000)
    },
    {
      id: uuidv4(),
      name: 'Book Club: Monthly Discussion',
      topic: 'Discussing "The Midnight Library" by Matt Haig',
      host: mockUsers[2] as User,
      participants: [
        {
          user: mockUsers[2] as User,
          role: 'host',
          isMuted: false,
          joinedAt: new Date(Date.now() - 14400000)
        }
      ],
      isLive: false, // This room is not live anymore
      createdAt: new Date(Date.now() - 14400000)
    }
  ];
};
