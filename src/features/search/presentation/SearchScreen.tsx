import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppBar, SearchBar, EmptyState } from '@/core/components';
import { Search, Loader2, MapPin, Plus, Navigation, Globe2 } from 'lucide-react';
import { useHomeData } from '@/features/home/presentation/hooks/useHomeData';
import { PlaceDialog } from '@/features/home/presentation/components/PlaceDialog';
import { useThemeStore } from '@/core/theme/useThemeStore';
import { useSearchStore } from './state/useSearchStore';
import { useNavigate } from 'react-router-dom';

export interface GlobalSearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

export default function SearchScreen() {
  const { query, setQuery, isSearching: isLocalSearching, localResults, clearSearch } = useSearchStore();
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const [error, setError] = useState('');
  
  const { data: countries } = useHomeData();
  const { accentColor } = useThemeStore();
  const navigate = useNavigate();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<GlobalSearchResult | null>(null);

  useEffect(() => {
    return () => clearSearch();
  }, [clearSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    
    let isMounted = true;
    const fetchResults = async () => {
      setIsLoadingGlobal(true);
      setError('');
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedQuery)}&format=json&limit=10`, {
          headers: {
            'User-Agent': 'GlobeTrailApp/1.0'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        if (isMounted) {
          setResults(data);
        }
      } catch (err) {
        if (isMounted) setError('Error fetching global places. Try again later.');
      } finally {
        if (isMounted) setIsLoadingGlobal(false);
      }
    };
    
    fetchResults();
    return () => { isMounted = false; };
  }, [debouncedQuery]);

  const handleAdd = (result: GlobalSearchResult) => {
    setSelectedResult(result);
    setIsDialogOpen(true);
  };
  
  const hasLocalResults = localResults.countries.length > 0 || localResults.places.length > 0;

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
          placeholder="Search saved places or global cities..."
        />
        
        <div className="mt-6">
          {!debouncedQuery ? (
            <div className="mt-8">
              <EmptyState
                icon={<Search className="w-8 h-8" />}
                title="Search Places"
                description="Find your saved places, countries, or search for new global destinations."
              />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Local Results */}
              {isLocalSearching ? (
                 <div className="flex justify-center py-6">
                   <Loader2 className="w-6 h-6 text-textMuted animate-spin" />
                 </div>
              ) : hasLocalResults ? (
                <div>
                  <h3 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-3">Saved Places</h3>
                  <div className="space-y-3">
                    {localResults.countries.map(c => (
                      <motion.div 
                        key={c.uuid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => navigate('/')}
                        className="bg-card-surface border border-fine-border rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1 overflow-hidden">
                          <div className="mt-1 bg-white/5 p-2 rounded-full text-textMuted">
                            <Globe2 className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{c.countryName}</h4>
                            <p className="text-textMuted text-xs truncate mt-0.5">Country</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {localResults.places.map(p => (
                      <motion.div 
                        key={p.uuid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => navigate(`/place/${p.uuid}`)}
                        className="bg-card-surface border border-fine-border rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1 overflow-hidden">
                          <div className="mt-1 bg-white/5 p-2 rounded-full text-textMuted">
                            <Navigation className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{p.name}</h4>
                            <p className="text-textMuted text-xs truncate mt-0.5">{p.category} • {p.status}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Global Results */}
              <div>
                <h3 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-3">Global Search</h3>
                {isLoadingGlobal ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 text-textMuted animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-center py-4 text-error text-sm">{error}</div>
                ) : results.length === 0 ? (
                  <div className="text-center py-4 text-textMuted text-sm">No global places found.</div>
                ) : (
                  <div className="space-y-3">
                    {results.map((result) => (
                      <motion.div 
                        key={result.place_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-card-surface border border-fine-border rounded-2xl p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3 flex-1 overflow-hidden">
                          <div className="mt-1 bg-white/5 p-2 rounded-full text-textMuted">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{result.display_name.split(',')[0]}</h4>
                            <p className="text-textMuted text-xs truncate mt-0.5">{result.display_name.split(',').slice(1).join(',').trim()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAdd(result)}
                          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-transform active:scale-95 text-canvas-black"
                          style={{ backgroundColor: `var(--color-accent-${accentColor})` }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      <PlaceDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        countries={countries || []}
        initialData={selectedResult ? {
          name: selectedResult.display_name.split(',')[0],
          latitude: selectedResult.lat,
          longitude: selectedResult.lon
        } : undefined}
      />
    </div>
  );
}
