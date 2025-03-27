
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConversationProvider } from "@/contexts/ConversationContext";
import { VoiceRoomProvider } from "@/contexts/VoiceRoomContext";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import VoiceRooms from "./pages/VoiceRooms";
import VoiceRoomDetail from "./pages/VoiceRoomDetail";
import TextChannelPage from "./pages/TextChannelPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ConversationProvider>
        <VoiceRoomProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:conversationId" element={<Chat />} />
              <Route path="/voice-rooms" element={<VoiceRooms />} />
              <Route path="/voice-rooms/:roomId" element={<VoiceRoomDetail />} />
              <Route path="/text-channels/:channelId" element={<TextChannelPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </VoiceRoomProvider>
      </ConversationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
