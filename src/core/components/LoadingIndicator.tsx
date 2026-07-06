import React from 'react';
import { cn } from '@/core/utils/cn';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export function LoadingIndicator({ fullScreen, message, className }: LoadingIndicatorProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className="w-8 h-8 text-active-accent animate-spin" />
      {message && <p className="text-sm text-textMuted font-medium">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas-black/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
