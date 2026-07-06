import { motion } from 'motion/react';
import { Search } from 'lucide-react';

export default function SearchScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
        <input 
          type="text" 
          placeholder="Search global coordinates, cities..." 
          className="w-full bg-card-surface border border-fine-border rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent-steel transition-colors"
          disabled
        />
      </div>
      <div className="mt-8 text-center text-textMuted">
        Autocomplete Implementation Pending
      </div>
    </motion.div>
  );
}
