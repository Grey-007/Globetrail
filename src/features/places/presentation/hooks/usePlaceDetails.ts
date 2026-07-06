import { useState, useEffect } from 'react';
import { locationRepository } from '@/core/di/injection';
import type { Place } from '@/features/home/domain/entities/Place';
import type { Country } from '@/features/home/domain/entities/Country';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/database/localDatabase';

export function usePlaceDetails(uuid?: string) {
  const data = useLiveQuery(async () => {
    if (!uuid) return null;
    const place = await db.places.get(uuid);
    if (!place) return null;
    
    const country = await db.countries.get(place.countryUuid);
    
    // Future: fetch notes and photos for this place
    
    return {
      place,
      country
    };
  }, [uuid]);

  return {
    place: data?.place,
    country: data?.country,
    isLoading: data === undefined
  };
}
