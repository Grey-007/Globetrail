import { motion } from 'motion/react';
import { AppBar } from '@/core/components';

export default function StatisticsScreen() {
  return (
    <div className="min-h-full pb-24">
      <AppBar title="Metrics" centerTitle />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 md:p-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card-surface border border-fine-border rounded-2xl p-6 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl mb-2 text-white">0</span>
            <span className="text-xs text-textMuted tracking-wider uppercase font-medium">Saved Places</span>
          </div>
          <div className="bg-card-surface border border-fine-border rounded-2xl p-6 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl mb-2" style={{ color: 'var(--color-active-accent)' }}>0</span>
            <span className="text-xs text-textMuted tracking-wider uppercase font-medium">Visited</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
