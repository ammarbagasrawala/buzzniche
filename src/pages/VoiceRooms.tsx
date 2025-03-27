import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useVoiceRoom } from '@/contexts/VoiceRoomContext';
import VoiceRoomCard from '@/components/VoiceRoomCard';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import VoiceChannelSidebar from '@/components/VoiceChannelSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const VoiceRooms = () => {
  const navigate = useNavigate();
  const { voiceRooms, loadingRooms, createRoom } = useVoiceRoom();
  const [searchQuery, setSearchQuery] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomTopic, setRoomTopic] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const filteredRooms = voiceRooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (room.topic && room.topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleCreateRoom = () => {
    if (!roomName.trim()) return;
    
    const newRoom = createRoom(roomName, roomTopic || undefined);
    setRoomName('');
    setRoomTopic('');
    setIsDialogOpen(false);
    
    // Navigate to the new room
    navigate(`/voice-rooms/${newRoom.id}`);
  };
  
  // Loading state
  if (loadingRooms) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading voice rooms...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Mobile: Show only voice rooms without sidebar
  if (isMobile) {
    return (
      <Layout>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Voice Rooms</h2>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full text-primary hover:bg-primary/5 transition-colors">
                    <PlusCircle size={20} />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a Voice Room</DialogTitle>
                    <DialogDescription>
                      Start a new voice room to chat with others
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="room-name">Room Name</Label>
                      <Input 
                        id="room-name"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Enter room name..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="room-topic">Topic (optional)</Label>
                      <Textarea 
                        id="room-topic"
                        value={roomTopic}
                        onChange={(e) => setRoomTopic(e.target.value)}
                        placeholder="What would you like to talk about?"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateRoom} disabled={!roomName.trim()}>
                      Create Room
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="relative">
              <input 
                type="text"
                placeholder="Search rooms"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map((room) => (
                  <VoiceRoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="max-w-md">
                  <h3 className="text-lg font-medium mb-2">No voice rooms found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "No rooms match your search. Try a different query."
                      : "There are no active voice rooms. Create one to get started!"}
                  </p>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Create a Room</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create a Voice Room</DialogTitle>
                        <DialogDescription>
                          Start a new voice room to chat with others
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="room-name">Room Name</Label>
                          <Input 
                            id="room-name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Enter room name..."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="room-topic">Topic (optional)</Label>
                          <Textarea 
                            id="room-topic"
                            value={roomTopic}
                            onChange={(e) => setRoomTopic(e.target.value)}
                            placeholder="What would you like to talk about?"
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateRoom} disabled={!roomName.trim()}>
                          Create Room
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }
  
  // Desktop: Show Discord-like sidebar with channel list
  return (
    <Layout
      sidebar={<VoiceChannelSidebar />}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Voice Rooms</h2>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="w-8 h-8 flex items-center justify-center rounded-full text-primary hover:bg-primary/5 transition-colors">
                  <PlusCircle size={20} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a Voice Room</DialogTitle>
                  <DialogDescription>
                    Start a new voice room to chat with others
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input 
                      id="room-name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter room name..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="room-topic">Topic (optional)</Label>
                    <Textarea 
                      id="room-topic"
                      value={roomTopic}
                      onChange={(e) => setRoomTopic(e.target.value)}
                      placeholder="What would you like to talk about?"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRoom} disabled={!roomName.trim()}>
                    Create Room
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="relative">
            <input 
              type="text"
              placeholder="Search rooms"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => (
                <VoiceRoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="max-w-md">
                <h3 className="text-lg font-medium mb-2">No voice rooms found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "No rooms match your search. Try a different query."
                    : "There are no active voice rooms. Create one to get started!"}
                </p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Create a Room</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a Voice Room</DialogTitle>
                      <DialogDescription>
                        Start a new voice room to chat with others
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="room-name">Room Name</Label>
                        <Input 
                          id="room-name"
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                          placeholder="Enter room name..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="room-topic">Topic (optional)</Label>
                        <Textarea 
                          id="room-topic"
                          value={roomTopic}
                          onChange={(e) => setRoomTopic(e.target.value)}
                          placeholder="What would you like to talk about?"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateRoom} disabled={!roomName.trim()}>
                        Create Room
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VoiceRooms;
