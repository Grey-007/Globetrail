import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Navigation, MapPin } from 'lucide-react';
import { AppBar, BottomSheet, StatusChip } from '@/core/components';
import { Globe } from './components/Globe';
import { useGlobeData, GlobePlace } from './hooks/useGlobeData';
import { cn } from '@/core/utils/cn';
import { useThemeStore } from '@/core/theme/useThemeStore';

export default function GlobeScreen() {
  const navigate = useNavigate();
  const places = useGlobeData();
  const { accentColor } = useThemeStore();
  const [selectedPlace, setSelectedPlace] = useState<GlobePlace | null>(null);
  
  // Filters
  const [filterType, setFilterType] = useState<'all' | 'visited' | 'wishlist' | 'favorites'>('all');

  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      if (filterType === 'visited') return p.status === 'visited';
      if (filterType === 'wishlist') return p.status === 'wishlist';
      if (filterType === 'favorites') return p.isFavorite;
      return true;
    });
  }, [places, filterType]);

  return (
    <div className="h-full flex flex-col bg-canvas-black relative overflow-hidden">
      {/* Absolute Header so it overlays the globe */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <AppBar title="Globe" centerTitle className="bg-canvas-black/30 backdrop-blur-md border-b border-white/5" />
        </div>
        
        {/* Filters */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto">
          {(['all', 'visited', 'wishlist', 'favorites'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap",
                filterType === f 
                  ? "text-canvas-black shadow-lg" 
                  : "bg-card-surface/80 backdrop-blur-md border border-fine-border text-textMuted hover:text-white"
              )}
              style={filterType === f ? { backgroundColor: `var(--color-accent-${accentColor})` } : undefined}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <Globe 
          places={places} 
          filteredPlaces={filteredPlaces}
          onPinClick={setSelectedPlace} 
        />
      </div>

      <BottomSheet
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        title={selectedPlace?.name}
      >
        {selectedPlace && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-textMuted text-sm font-medium">
              <MapPin className="w-4 h-4" />
              {selectedPlace.countryName}
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusChip 
                status={selectedPlace.status} 
                variant={selectedPlace.status === 'visited' ? 'visited' : 'wishlist'} 
              />
              <StatusChip 
                status={selectedPlace.category} 
                variant="neutral" 
              />
              {selectedPlace.isFavorite && (
                <StatusChip status="Favorite" variant="favorite" />
              )}
            </div>

            {selectedPlace.notes && (
              <p className="text-sm text-textMuted leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                {selectedPlace.notes}
              </p>
            )}

            <button
              onClick={() => {
                navigate(`/place/${selectedPlace.uuid}`);
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-canvas-black transition-transform active:scale-95 focus:outline-none shadow-lg"
              style={{ backgroundColor: `var(--color-accent-${accentColor})` }}
            >
              <Navigation className="w-5 h-5" />
              Open Details
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
