
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Message } from '@/types';
import { Play, FileText, File, X } from 'lucide-react';

interface MediaPreviewProps {
  media: Message['media'][0];
  className?: string;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  media, 
  className
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => setExpanded(!expanded);
  
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  if (media.type === 'image') {
    return (
      <div className={cn("relative", className)}>
        <div 
          className={cn(
            "relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 bg-black/5",
            expanded ? "w-full max-w-xs" : "w-40 h-40"
          )}
          onClick={toggleExpand}
        >
          <img 
            src={media.url} 
            alt={media.name || "Image"} 
            className={cn(
              "object-cover transition-all duration-500",
              expanded ? "w-full" : "w-full h-full"
            )}
            loading="lazy"
          />
          
          {expanded && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }
  
  if (media.type === 'video') {
    return (
      <div className={cn("relative", className)}>
        <div 
          className={cn(
            "relative rounded-lg overflow-hidden cursor-pointer",
            expanded ? "w-full max-w-xs" : "w-40 h-40"
          )}
          onClick={toggleExpand}
        >
          {expanded ? (
            <video 
              src={media.url} 
              controls 
              className="w-full" 
              autoPlay
            />
          ) : (
            <>
              <img 
                src={media.previewUrl || media.url} 
                alt={media.name || "Video preview"} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center">
                  <Play size={24} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  
  // For files and other types
  return (
    <div className="flex items-center p-3 rounded-lg bg-background/80 border">
      <div className="mr-3">
        {media.type === 'audio' ? (
          <div className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center">
            <FileText size={20} />
          </div>
        ) : (
          <div className="w-10 h-10 rounded bg-muted text-muted-foreground flex items-center justify-center">
            <File size={20} />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{media.name || "File"}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(media.size)}
        </p>
      </div>
    </div>
  );
};

export default MediaPreview;
