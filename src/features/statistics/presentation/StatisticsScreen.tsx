import { motion } from 'motion/react';

export default function StatisticsScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6"
    >
      <header className="mb-8">
        <h1 className="font-display text-2xl tracking-tight">METRICS</h1>
      </header>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-fine-border rounded-2xl p-6 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl mb-2 text-white">0</span>
          <span className="text-xs text-textMuted tracking-wider uppercase">Saved Places</span>
        </div>
        <div className="border border-fine-border rounded-2xl p-6 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl mb-2 text-accent-sage">0</span>
          <span className="text-xs text-textMuted tracking-wider uppercase">Visited</span>
        </div>
      </div>
    </motion.div>
  );
}
