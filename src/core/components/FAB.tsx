import React from 'react';
import { cn } from '@/core/utils/cn';

type FABProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
};

export function FAB({ 
  icon, 
  label, 
  position = 'bottom-right', 
  className,
  ...props 
}: FABProps) {
  const positionClasses = {
    'bottom-right': 'bottom-24 right-4',
    'bottom-left': 'bottom-24 left-4',
    'bottom-center': 'bottom-24 left-1/2 -translate-x-1/2',
  };

  return (
    <button
      className={cn(
        "fixed z-40 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95",
        label ? "px-5 py-4 rounded-full" : "w-14 h-14 rounded-2xl",
        "bg-accent text-canvas",
        positionClasses[position],
        className
      )}
      {...props}
    >
      {icon}
      {label && <span className="font-semibold">{label}</span>}
    </button>
  );
}
