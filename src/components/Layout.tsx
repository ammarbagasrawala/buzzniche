
import React from 'react';
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  header,
  sidebar,
  className
}) => {
  const hasSidebar = !!sidebar;
  
  return (
    <div className={cn(
      "flex flex-col h-screen bg-background", 
      className
    )}>
      {header}
      
      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <div className="w-[320px] border-r h-full overflow-hidden flex-shrink-0 bg-secondary/30">
            {sidebar}
          </div>
        )}
        
        <main className={cn(
          "flex-1 overflow-hidden",
          hasSidebar ? "w-[calc(100%-320px)]" : "w-full"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
