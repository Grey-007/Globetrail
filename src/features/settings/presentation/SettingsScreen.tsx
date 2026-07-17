import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { cn } from '@/core/utils/cn';
import { Moon, Sun, Download, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { BackupManager } from '@/core/backup/BackupManager';

export default function SettingsScreen() {
  const { mode, toggleMode } = useThemeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [status, setStatus] = useState<{type: 'idle' | 'success' | 'error', message: string}>({ type: 'idle', message: '' });

  const handleExport = async () => {
    try {
      const data = await BackupManager.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `globetrail-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setStatus({ type: 'success', message: 'Backup exported successfully!' });
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
    } catch (e) {
      setStatus({ type: 'error', message: 'Failed to export backup.' });
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
    }
  };

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        await BackupManager.importData(content);
        setStatus({ type: 'success', message: 'Data imported successfully! Reloading...' });
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        setStatus({ type: 'error', message: 'Invalid backup file.' });
        setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
      }
    };
    reader.onerror = () => {
      setStatus({ type: 'error', message: 'Failed to read file.' });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
                  mode === 'dark' ? "bg-card border border-accent" : ""
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full bg-accent transition-all duration-300 emboss",
                  mode === 'dark' ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium tracking-wide text-text-muted mb-4 uppercase">Data</h2>
            <div className="space-y-3">
              <div className="emboss rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform" onClick={handleExport}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full deboss flex items-center justify-center">
                    <Download className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-main block">Export Backup</span>
                    <span className="text-xs text-text-muted">Save your data to a JSON file</span>
                  </div>
                </div>
              </div>
              
              <div className="emboss rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform" onClick={handleImport}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full deboss flex items-center justify-center">
                    <Upload className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-main block">Import Backup</span>
                    <span className="text-xs text-text-muted">Restore data from a JSON file</span>
                  </div>
                </div>
              </div>
            </div>

            <input 
              type="file" 
              accept=".json,application/json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {status.type !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-4 p-3 rounded-xl flex items-center gap-2 text-sm",
                  status.type === 'success' ? "emboss bg-canvas text-green-500" : "emboss bg-canvas text-red-500"
                )}
              >
                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {status.message}
              </motion.div>
            )}
          </section>
        </div>
      </motion.div>
    </div>
  );
}
