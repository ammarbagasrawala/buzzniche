
import React from 'react';
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { MessageSquare, Settings, User } from 'lucide-react';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <header className={cn(
      "h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10 flex items-center px-6",
      className
    )}>
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="text-xl font-medium">
          messenger
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/chat" 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-foreground"
          >
            <MessageSquare size={20} />
          </Link>
          
          <Link 
            to="/profile" 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-foreground"
          >
            <User size={20} />
          </Link>
          
          <Link 
            to="/settings" 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-foreground"
          >
            <Settings size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
