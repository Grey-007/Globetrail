import React from 'react';
import { motion } from 'motion/react';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { cn } from '@/core/utils/cn';
import { AppBar } from '@/core/components';

export default function SettingsScreen() {
  const { accentColor, setAccentColor, amoledMode, setAmoledMode } = useThemeStore();

  const accents = [
    { id: 'steel', hex: '#8E8E93', name: 'Steel' },
    { id: 'ice', hex: '#A1C4FD', name: 'Ice' },
    { id: 'sage', hex: '#8FBC8F', name: 'Sage' },
    { id: 'coral', hex: '#FF7F50', name: 'Coral' },
    { id: 'teal', hex: '#008080', name: 'Teal' },
  ] as const;

  return (
    <div className="min-h-full pb-24">
      <AppBar title="Settings" centerTitle />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 md:p-6"
      >
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-medium tracking-wide text-textMuted mb-4 uppercase">Appearance</h2>
            <div className="bg-card-surface border border-fine-border rounded-2xl p-1 divide-y divide-fine-border">
              
              <div className="flex items-center justify-between p-4">
                <span className="text-sm font-medium text-white">AMOLED True Black</span>
                <button 
                  onClick={() => setAmoledMode(!amoledMode)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none",
                    amoledMode ? "bg-[var(--color-active-accent)]" : "bg-black border border-fine-border"
                  )}
                  style={{ '--color-active-accent': `var(--color-accent-${accentColor})` } as React.CSSProperties}
                >
                  <div className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm",
                    amoledMode ? "left-[26px]" : "left-0.5"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4">
                <span className="text-sm font-medium text-white">Accent Color</span>
                <div className="flex items-center gap-2">
                  {accents.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setAccentColor(a.id as any)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-transform focus:outline-none",
                        accentColor === a.id ? "border-white scale-110" : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: a.hex }}
                      aria-label={`Select ${a.name} accent`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium tracking-wide text-textMuted mb-4 uppercase">Data</h2>
            <div className="bg-card-surface border border-dashed border-fine-border rounded-2xl p-6 text-center">
              <p className="text-textMuted text-sm mb-2">Backup & Restore</p>
              <p className="text-textMuted/60 text-xs">Implementation Pending</p>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
