import React from 'react';
import { motion } from 'motion/react';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { cn } from '@/core/utils/cn';
import { Moon, Sun } from 'lucide-react';

export default function SettingsScreen() {
  const { mode, toggleMode } = useThemeStore();

  return (
    <div className="min-h-full pb-24 px-6 pt-12">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-widest text-text-main">
          SETTINGS
        </h1>
      </header>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-medium tracking-wide text-text-muted mb-4 uppercase">Appearance</h2>
            <div className="emboss rounded-2xl p-4 flex items-center justify-between cursor-pointer" onClick={toggleMode}>
              <div className="flex items-center gap-3">
                {mode === 'dark' ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
                <span className="text-sm font-medium text-text-main">{mode === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
              </div>
              <div 
                className={cn(
                  "w-12 h-6 rounded-full deboss relative transition-colors duration-300 flex items-center px-0.5",
                  mode === 'dark' ? "bg-accent/20" : ""
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-accent transition-all duration-300 shadow-sm",
                  mode === 'dark' ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium tracking-wide text-text-muted mb-4 uppercase">Data</h2>
            <div className="deboss rounded-2xl p-6 text-center">
              <p className="text-text-muted text-sm mb-2">Backup & Restore</p>
              <p className="text-text-muted/60 text-xs">Implementation Pending</p>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
