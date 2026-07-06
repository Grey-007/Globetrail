import { motion } from 'motion/react';

export default function GlobeScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full p-4"
    >
      <div className="w-64 h-64 border border-fine-border rounded-full flex items-center justify-center relative overflow-hidden">
        {/* Placeholder for 3D Globe Canvas */}
        <div className="absolute inset-0 border-[0.5px] border-fine-border/50 rounded-full scale-90" />
        <div className="absolute inset-0 border-[0.5px] border-fine-border/50 rounded-full scale-75" />
        <span className="text-textMuted text-sm font-mono tracking-widest z-10">3D RENDER PENDING</span>
      </div>
    </motion.div>
  );
}
