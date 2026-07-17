import React from 'react';
import { cn } from '@/core/utils/cn';

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function FilterChip({ label, selected, icon, className, ...props }: FilterChipProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none whitespace-nowrap",
        selected 
          ? "bg-accent text-canvas deboss" 
          : "emboss text-text-muted hover:text-text-main",
        className
      )}
      {...props}
    >
      {icon && <span className={cn("w-4 h-4", selected ? "text-canvas" : "text-text-muted")}>{icon}</span>}
      {label}
    </button>
  );
}
