import React from 'react';
import { cn } from '@/core/utils/cn';

interface AppBarProps {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
  centerTitle?: boolean;
}

export function AppBar({ title, leading, trailing, className, centerTitle = false }: AppBarProps) {
  return (
    <header className={cn(
      "sticky top-0 z-30 bg-canvas/80 backdrop-blur-md border-b border-border px-4 h-16 pt-safe",
      className
    )}>
      <div className="h-full flex items-center justify-between">
        <div className="flex-1 flex items-center justify-start min-w-[48px]">
          {leading}
        </div>
        
        <div className={cn(
          "flex-2 truncate px-2 text-lg font-semibold tracking-wide",
          centerTitle ? "text-center" : "text-left"
        )}>
          {title}
        </div>

        <div className="flex-1 flex items-center justify-end min-w-[48px]">
          {trailing}
        </div>
      </div>
    </header>
  );
}
