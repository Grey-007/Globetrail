import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/core/utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-textMuted" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-3 bg-canvas-black border border-fine-border rounded-xl text-white placeholder-textMuted/60 focus:outline-none focus:border-white transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-textMuted hover:text-white transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
