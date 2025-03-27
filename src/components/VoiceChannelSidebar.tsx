
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Headphones, MessageSquare, Settings, Plus, Volume2 } from 'lucide-react';
import { useVoiceRoom } from '@/contexts/VoiceRoomContext';

interface VoiceChannelSidebarProps {
  className?: string;
}

const VoiceChannelSidebar: React.FC<VoiceChannelSidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { voiceRooms, activeRoomId } = useVoiceRoom();
  
  const liveRooms = voiceRooms.filter(room => room.isLive);
  
  const categories = [
    {
      id: 'text-channels',
      name: 'TEXT CHANNELS',
      channels: [
        { id: 'general', name: 'general', type: 'text' },
        { id: 'welcome', name: 'welcome', type: 'text' },
        { id: 'announcements', name: 'announcements', type: 'text' },
      ]
    },
    {
      id: 'voice-channels',
      name: 'VOICE CHANNELS',
      channels: liveRooms.map(room => ({
        id: room.id,
        name: room.name,
        type: 'voice',
        participants: room.participants.length,
        isActive: room.id === activeRoomId
      }))
    }
  ];
  
  const handleChannelClick = (channelId: string, type: string) => {
    if (type === 'voice') {
      navigate(`/voice-rooms/${channelId}`);
    } else {
      // For text channels, navigate to a new text channel route
      navigate(`/text-channels/${channelId}`);
    }
  };
  
  const handleCreateChannel = () => {
    navigate('/voice-rooms');
  };
  
  const isTextChannelActive = (channelId: string) => {
    return location.pathname === `/text-channels/${channelId}`;
  };
  
  return (
    <div className={cn("flex flex-col h-full bg-secondary/30", className)}>
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Lovable Community</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {categories.map((category) => (
          <div key={category.id} className="mb-6">
            <div className="flex items-center justify-between px-2 mb-1">
              <h3 className="text-xs font-semibold text-muted-foreground">
                {category.name}
              </h3>
              {category.id === 'voice-channels' && (
                <button 
                  onClick={handleCreateChannel}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Plus size={14} />
                </button>
              )}
            </div>
            
            <div className="space-y-0.5">
              {category.channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelClick(channel.id, channel.type)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded flex items-center group hover:bg-secondary/80",
                    (channel.isActive || (channel.type === 'text' && isTextChannelActive(channel.id))) && "bg-secondary"
                  )}
                >
                  {channel.type === 'text' ? (
                    <MessageSquare size={16} className="mr-2 text-muted-foreground" />
                  ) : (
                    <Volume2 size={16} className="mr-2 text-muted-foreground" />
                  )}
                  
                  <span className="flex-1 text-sm">{channel.name}</span>
                  
                  {'participants' in channel && (
                    <span className="text-xs text-muted-foreground">
                      {channel.participants}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t bg-secondary/50">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
            <Headphones size={14} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Voice Connected</div>
            {activeRoomId && (
              <div className="text-xs text-muted-foreground">
                {voiceRooms.find(r => r.id === activeRoomId)?.name || 'Unknown room'}
              </div>
            )}
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceChannelSidebar;
