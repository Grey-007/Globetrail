import { useState } from 'react';
import { motion } from 'motion/react';
import { AppBar, SearchBar, EmptyState } from '@/core/components';
import { Search } from 'lucide-react';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-full pb-24">
      <AppBar title="Search" centerTitle />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 md:p-6"
      >
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search global coordinates, cities..."
        />
        
        <div className="mt-8">
          <EmptyState
            icon={<Search className="w-8 h-8" />}
            title="Search Places"
            description="Find your saved places, countries, or search for new destinations."
          />
        </div>
      </motion.div>
    </div>
  );
}
