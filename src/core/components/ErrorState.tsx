import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { cn } from '@/core/utils/cn';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  fullScreen?: boolean;
}

export function ErrorState({ title = "Something went wrong", message, onRetry, className, fullScreen }: ErrorStateProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center text-center p-6", className)}>
      <div className="w-16 h-16 mb-4 rounded-full deboss bg-canvas flex items-center justify-center text-error">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-text-main mb-2">{title}</h3>
      <p className="text-text-muted text-sm max-w-xs mx-auto mb-6">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-full deboss hover:text-accent transition-colors text-text-main font-medium text-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas">
        {content}
      </div>
    );
  }

  return content;
}
