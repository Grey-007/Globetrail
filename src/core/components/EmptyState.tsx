import React from 'react';
import { cn } from '@/core/utils/cn';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8", className)}>
      <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center text-textMuted">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-textMuted text-sm max-w-[250px] mx-auto mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}
