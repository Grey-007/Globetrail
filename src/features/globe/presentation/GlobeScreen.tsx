import { useState, useMemo, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, MapPin } from 'lucide-react';
import { BottomSheet, StatusChip } from '@/core/components';
import { useGlobeData, GlobePlace } from './hooks/useGlobeData';
import { cn } from '@/core/utils/cn';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { useSearchStore } from '@/features/search/presentation/state/useSearchStore';

const Globe = lazy(() => import('./components/Globe').then(m => ({ default: m.Globe })));

export default function GlobeScreen() {
  const navigate = useNavigate();
  const places = useGlobeData();
  const [selectedPlace, setSelectedPlace] = useState<GlobePlace | null>(null);
  
  const { query, localResults } = useSearchStore();

  // Filters
  const [filterType, setFilterType] = useState<'all' | 'visited' | 'planning' | 'favorites'>('all');

  const filteredPlaces = useMemo(() => {
    let result = places;
    
    // Apply global search filter
    if (query.trim() !== '') {
      const resultPlaceIds = new Set(localResults.places.map(p => p.uuid));
      const resultCountryIds = new Set(localResults.countries.map(c => c.uuid));
      result = result.filter(p => resultPlaceIds.has(p.uuid) || resultCountryIds.has(p.countryUuid));
    }
    
    // Apply local status filter
    return result.filter(p => {
      if (filterType === 'visited') return p.status === 'visited';
      if (filterType === 'planning') return p.status === 'planning';
      if (filterType === 'favorites') return p.isFavorite;
      return true;
    });
  }, [places, filterType, query, localResults]);

  return (
    <div className="h-full flex flex-col bg-canvas relative overflow-hidden">
      {/* Absolute Header so it overlays the globe */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none pt-12">
        <div className="pointer-events-auto px-6 mb-4">
           <h1 className="font-serif text-3xl font-bold tracking-widest text-text-main">
            GLOBE
          </h1>
        </div>
        
        {/* Filters */}
        <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto">
          {(['all', 'visited', 'planning', 'favorites'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap",
                filterType === f 
                  ? "bg-accent text-canvas emboss" 
                  : "emboss text-text-muted hover:text-text-main"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin"></div>
          </div>
        }>
          <Globe 
            places={places} 
            filteredPlaces={filteredPlaces}
            onPinClick={setSelectedPlace} 
          />
        </Suspense>
      </div>

      <BottomSheet
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        title={selectedPlace?.name}
      >
        {selectedPlace && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
              <MapPin className="w-4 h-4" />
              {selectedPlace.countryName}
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusChip 
                status={selectedPlace.status} 
                variant={selectedPlace.status === 'visited' ? 'visited' : 'planning'} 
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
              <p className="text-sm text-text-muted leading-relaxed deboss p-4 rounded-xl">
                {selectedPlace.notes}
              </p>
            )}

            <button
              onClick={() => {
                navigate(`/place/${selectedPlace.uuid}`);
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium bg-accent text-canvas transition-transform active:scale-95 focus:outline-none emboss"
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

