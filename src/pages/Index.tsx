
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Navbar from '@/components/Navbar';
import { useConversation } from '@/contexts/ConversationContext';
import { ArrowRight, MessageSquare, Users, Image, Video, Shield } from 'lucide-react';

const Index = () => {
  const { conversations } = useConversation();
  
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Seamless Messaging',
      description: 'Send and receive messages with a beautiful, intuitive interface'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Group Conversations',
      description: 'Create groups to chat with multiple people at once'
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: 'Media Sharing',
      description: 'Share photos, videos, and files effortlessly'
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: 'Voice & Video',
      description: 'Connect with voice and video calls anytime'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Private & Secure',
      description: 'Your conversations are private and secure'
    }
  ];

  return (
    <Layout header={<Navbar />}>
      <div className="min-h-full">
        {/* Hero Section */}
        <section className="px-6 py-20 md:py-32 flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 animate-fade-in">
            Communication,
            <br />
            <span className="text-primary">simplified.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mb-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
            A minimalist messaging platform that focuses on what matters most—your conversations. Clean, intuitive, and thoughtfully designed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Link
              to="/chat"
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              Open Messages
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              to="#features"
              className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </section>
        
        {/* App Preview */}
        <section className="px-6 py-16 bg-secondary/50">
          <div className="max-w-6xl mx-auto">
            <div className="glass rounded-3xl overflow-hidden shadow-xl animate-scale-in">
              <div className="aspect-[16/9] relative bg-background/50">
                <div className="absolute inset-0 flex">
                  <div className="w-[300px] border-r h-full bg-secondary/30 p-4 overflow-hidden">
                    <h3 className="font-medium mb-4 px-2">Recent Conversations</h3>
                    
                    {conversations.slice(0, 3).map((conversation, index) => {
                      const otherUser = conversation.participants.find(p => p.id !== 'current-user');
                      
                      return (
                        <div 
                          key={conversation.id}
                          className="p-2 rounded-lg mb-2 hover:bg-background/50 transition-colors cursor-pointer"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 shrink-0 overflow-hidden">
                              {otherUser?.avatar && (
                                <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="ml-2 overflow-hidden">
                              <p className="font-medium text-sm truncate">{conversation.isGroup ? 'Group' : otherUser?.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {conversation.lastMessage?.text || 'No messages'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="pb-3 border-b mb-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="w-full h-full object-cover" />
                      </div>
                      <p className="font-medium ml-2">Alex Johnson</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                      <div className="mb-4 max-w-[60%] p-3 rounded-2xl rounded-tl-sm bg-secondary">
                        <p className="text-sm">Hey there! How's it going?</p>
                      </div>
                      
                      <div className="mb-4 max-w-[60%] ml-auto p-3 rounded-2xl rounded-tr-sm bg-primary text-primary-foreground">
                        <p className="text-sm">I'm doing great! Just checking out this new app.</p>
                      </div>
                      
                      <div className="mb-4 max-w-[60%] p-3 rounded-2xl rounded-tl-sm bg-secondary">
                        <p className="text-sm">It looks really clean and minimal. I like the design!</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-auto flex items-center">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 p-3 rounded-full bg-secondary text-foreground focus:outline-none"
                      />
                      <button className="ml-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-medium text-center mb-16">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl bg-background border hover:shadow-md transition-shadow animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="px-6 py-16 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-medium mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our minimal messaging platform and experience the perfect balance between functionality and design.
            </p>
            
            <Link
              to="/chat"
              className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Messages
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
