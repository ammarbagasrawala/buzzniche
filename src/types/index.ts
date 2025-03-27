
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
  media?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    previewUrl?: string;
    name?: string;
    size?: number;
  }[];
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
}

export interface VoiceParticipant {
  user: User;
  role: 'host' | 'speaker' | 'listener';
  isMuted: boolean;
  joinedAt: Date;
}
