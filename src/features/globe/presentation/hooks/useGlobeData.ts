import { useState, useEffect } from 'react';
import { db } from '@/core/database/localDatabase';
import { Place } from '@/features/home/domain/entities/Place';
import { Country } from '@/features/home/domain/entities/Country';

export interface GlobePlace extends Place {
  countryName: string;
}

export function useGlobeData() {
  const [places, setPlaces] = useState<GlobePlace[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        const allCountries = await db.countries.toArray();
        const countryMap = new Map<string, string>();
        allCountries.forEach(c => countryMap.set(c.uuid, c.countryName));
        
        const count = await db.places.count();
        const chunkSize = 50; // Load 50 pins at a time to keep UI responsive
        
        for (let i = 0; i < count; i += chunkSize) {
          if (!isMounted) break;
          
          const chunk = await db.places.offset(i).limit(chunkSize).toArray();
          const enriched: GlobePlace[] = chunk.map(p => ({
            ...p,
            countryName: countryMap.get(p.countryUuid) || 'Unknown'
          }));
          
          setPlaces(prev => [...prev, ...enriched]);
          
          // Yield to main thread to prevent UI freezing
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } catch (error) {
        console.error('Error loading globe data:', error);
      }
    };
    
    loadData();
    
    return () => { isMounted = false; };
  }, []);

  return places;
}
