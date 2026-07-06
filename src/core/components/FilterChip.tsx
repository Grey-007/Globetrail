import React from 'react';
import { cn } from '@/core/utils/cn';
import { useThemeStore } from '@/core/theme/useThemeStore';

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function FilterChip({ label, selected, icon, className, ...props }: FilterChipProps) {
  const { accentColor } = useThemeStore();
  
  return (
    <button
      className={cn(
        "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border focus:outline-none whitespace-nowrap",
        selected 
          ? "bg-[var(--color-active-accent)]/10 text-[var(--color-active-accent)] border-[var(--color-active-accent)]/30" 
          : "bg-canvas-black border-fine-border text-textMuted hover:bg-white/5",
        className
      )}
      style={{ '--color-active-accent': `var(--color-accent-${accentColor})` } as React.CSSProperties}
      {...props}
    >
      {icon && <span className={cn("w-4 h-4", selected ? "text-[var(--color-active-accent)]" : "text-textMuted")}>{icon}</span>}
      {label}
    </button>
  );
}
