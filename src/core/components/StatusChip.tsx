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
      case 'visited': return 'bg-success/10 text-success border-success/20';
      case 'planning': return 'deboss text-text-muted border-border';
      case 'booked': return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20';
      case 'archived': return 'deboss text-text-muted border-border opacity-50';
      case 'error': return 'bg-error/10 text-error border-error/20';
      case 'warning': return 'bg-warning/10 text-warning border-warning/20';
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
