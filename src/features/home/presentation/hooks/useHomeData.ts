import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/database/localDatabase';
import type { Country } from '../../domain/entities/Country';
import type { Place, Priority, PlaceStatus } from '../../domain/entities/Place';

export interface PlaceViewModel {
  id: string;
  name: string;
  category: string;
  isFavorite: boolean;
  status: PlaceStatus;
  priority: Priority;
  thumbnail?: string;
  countryId: string;
  raw: Place;
}

export interface CountryViewModel {
  id: string;
  name: string;
  flag: string;
  places: PlaceViewModel[];
  raw: Country;
}

export function useHomeData() {
  const data = useLiveQuery(async () => {
    const countries = await db.countries.toArray();
    const places = await db.places.toArray();

    // Sort countries alphabetically
    countries.sort((a, b) => a.countryName.localeCompare(b.countryName));

    const grouped: CountryViewModel[] = countries.map(c => {
      const cPlaces = places.filter(p => p.countryUuid === c.uuid);
      return {
        id: c.uuid,
        name: c.countryName,
        flag: c.flagEmoji,
        raw: c,
        places: cPlaces.map(p => ({
          id: p.uuid,
          name: p.name,
          category: p.category,
          isFavorite: p.isFavorite,
          status: p.status,
          priority: p.priority,
          countryId: p.countryUuid,
          raw: p,
        }))
      };
    });

    return grouped;
  });

  return { data: data || [], isLoading: data === undefined };
}
