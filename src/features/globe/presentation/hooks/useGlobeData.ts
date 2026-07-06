import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/database/localDatabase';
import { Place } from '@/features/home/domain/entities/Place';
import { Country } from '@/features/home/domain/entities/Country';

export interface GlobePlace extends Place {
  countryName: string;
}

export function useGlobeData() {
  return useLiveQuery(async () => {
    const allPlaces = await db.places.toArray();
    const allCountries = await db.countries.toArray();
    
    // Map country names for quick lookup
    const countryMap = new Map<string, string>();
    allCountries.forEach(c => countryMap.set(c.uuid, c.countryName));
    
    // Filter out places with no coordinates (if both are exactly 0, maybe hide or show at 0,0?)
    // Wait, let's keep them, or we can filter them if needed. 
    
    const enrichedPlaces: GlobePlace[] = allPlaces.map(p => ({
      ...p,
      countryName: countryMap.get(p.countryUuid) || 'Unknown'
    }));
    
    return enrichedPlaces;
  }, []) || [];
}
