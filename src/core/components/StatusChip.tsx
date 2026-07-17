import React from 'react';
import { cn } from '@/core/utils/cn';

interface StatusChipProps {
  status: string;
  variant?: 'visited' | 'planning' | 'booked' | 'archived' | 'neutral' | 'error' | 'warning' | 'favorite';
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusChip({ status, variant = 'neutral', className, size = 'sm' }: StatusChipProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'visited': return 'deboss bg-canvas text-success border-success';
      case 'planning': return 'deboss text-text-muted border-border';
      case 'booked': return 'deboss bg-canvas text-accent-blue border-accent-blue';
      case 'archived': return 'deboss bg-card text-text-muted border-border';
      case 'error': return 'deboss bg-canvas text-error border-error';
      case 'warning': return 'deboss bg-canvas text-warning border-warning';
      case 'favorite': return 'deboss text-text-main border-border';
      case 'neutral':
      default:
        return 'deboss text-text-muted border-border';
    }
  };

  return (
    <span className={cn(
      "rounded-full font-bold tracking-wider uppercase border",
      size === 'sm' ? "text-[10px] px-2.5 py-1" : "text-xs px-3 py-1.5",
      getVariantStyles(),
      className
    )}>
      {status}
    </span>
  );
}
