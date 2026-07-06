import { motion } from 'motion/react';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { cn } from '@/core/utils/cn';

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 pb-24"
    >
      <header className="mb-8">
        <h1 className="font-display text-2xl tracking-tight">PREFERENCES</h1>
      </header>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-medium tracking-wide text-textMuted mb-4 uppercase">Appearance</h2>
          <div className="border border-fine-border rounded-2xl p-1 divide-y divide-fine-border">
            
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">AMOLED True Black</span>
              <button 
                onClick={() => setAmoledMode(!amoledMode)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300",
                  amoledMode ? "bg-accent-steel" : "bg-card-surface border border-fine-border"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300",
                  amoledMode ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">Accent Color</span>
              <div className="flex items-center gap-2">
                {accents.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAccentColor(a.id as any)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform",
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
          <div className="border border-fine-border rounded-2xl p-4 text-center">
            <span className="text-xs text-textMuted">Backup & Restore Implementation Pending</span>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
