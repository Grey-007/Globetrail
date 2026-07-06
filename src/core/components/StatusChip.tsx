import React from 'react';
import { cn } from '@/core/utils/cn';

interface StatusChipProps {
  status: string;
  variant?: 'visited' | 'wishlist' | 'neutral' | 'error' | 'warning' | 'favorite';
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusChip({ status, variant = 'neutral', className, size = 'sm' }: StatusChipProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'visited': return 'bg-success/10 text-success border-success/20';
      case 'wishlist': return 'bg-white/5 text-textMuted border-white/10';
      case 'error': return 'bg-error/10 text-error border-error/20';
      case 'warning': return 'bg-warning/10 text-warning border-warning/20';
      case 'favorite': return 'bg-white/10 text-white border-white/20';
      case 'neutral':
      default:
        return 'bg-white/5 text-textMuted border-white/10';
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
