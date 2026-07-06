import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/database/localDatabase';
import { Place } from '@/features/home/domain/entities/Place';
import { Country } from '@/features/home/domain/entities/Country';

export interface GlobePlace extends Place {
  countryName: string;
}

export function useGlobeData() {
  const places = useLiveQuery(async () => {
    try {
      const allCountries = await db.countries.toArray();
      const countryMap = new Map<string, string>();
      allCountries.forEach(c => countryMap.set(c.uuid, c.countryName));
      
      const allPlaces = await db.places.toArray();
      const enriched: GlobePlace[] = allPlaces.map(p => ({
        ...p,
        countryName: countryMap.get(p.countryUuid) || 'Unknown'
      }));
      return enriched;
    } catch (error) {
      console.error('Error loading globe data:', error);
      return [];
    }
  });

  return places || [];
}
