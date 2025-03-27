
export interface User {
  id: string;
  name: string;
  avatar: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: Date;
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  timestamp: Date;
  isRead: boolean;
  reactions?: Reaction[];
  votes?: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  media?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    previewUrl?: string;
    name?: string;
    size?: number;
  }[];
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs who reacted
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  isGroup: boolean;
  name?: string;
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceRoom {
  id: string;
  name: string;
  description?: string;
  host: User;
  participants: VoiceParticipant[];
  isLive: boolean;
  topic?: string;
  createdAt: Date;
  reactions?: Reaction[];
  votes?: {
    upvotes: number;
    downvotes: number;
  };
}

export interface VoiceParticipant {
  user: User;
  role: 'host' | 'speaker' | 'listener';
  isMuted: boolean;
  joinedAt: Date;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'video';
  messages?: Message[];
  videos?: VideoPost[];
  participants?: VoiceParticipant[];
  isLive?: boolean;
}

export interface VideoPost {
  id: string;
  title?: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
  creator: User;
  reactions?: Reaction[];
  votes?: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
}
