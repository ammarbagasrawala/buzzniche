
import React from 'react';
import { cn } from "@/lib/utils";
import { User } from '@/types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  user, 
  size = 'md', 
  showStatus = false,
  className
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div 
        className={cn(
          "rounded-full overflow-hidden bg-secondary flex items-center justify-center",
          sizeClasses[size]
        )}
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-medium">
            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      
      {showStatus && user.status && (
        <div className={cn(
          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
          user.status === 'online' ? 'bg-green-500' : 
          user.status === 'away' ? 'bg-amber-500' : 'bg-gray-300'
        )} />
      )}
    </div>
  );
};

export default Avatar;
