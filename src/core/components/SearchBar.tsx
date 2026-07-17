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
        <Search className="w-5 h-5 text-text-muted" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-3 bg-canvas border border-border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:border-white transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-main transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
