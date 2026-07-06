import { GlobeTrailDatabase } from './localDatabase';
import { mockCountries } from '@/features/home/data/mockData';
import { Country } from '@/features/home/domain/entities/Country';
import { Place } from '@/features/home/domain/entities/Place';

export const seedDatabase = async (db: GlobeTrailDatabase) => {
  const count = await db.countries.count();
  if (count > 0) return; // Already seeded

  const countriesToInsert: Country[] = [];
  const placesToInsert: Place[] = [];

  for (const mockCountry of mockCountries) {
    countriesToInsert.push({
      uuid: mockCountry.id,
      isoCode: mockCountry.id.toUpperCase(),
      countryName: mockCountry.name,
      flagEmoji: mockCountry.flag,
      continent: 'Unknown',
      createdDate: new Date(),
      updatedDate: new Date(),
      version: 1,
      isDeleted: false,
    });

    for (const mockPlace of mockCountry.places) {
      placesToInsert.push({
        uuid: mockPlace.id,
        countryUuid: mockCountry.id,
        name: mockPlace.name,
        latitude: 0,
        longitude: 0,
        category: mockPlace.category,
        description: '',
        notes: '',
        priority: mockPlace.priority,
        status: mockPlace.status,
        isFavorite: mockPlace.isFavorite,
        createdDate: new Date(),
        updatedDate: new Date(),
        version: 1,
        isDeleted: false,
      });
    }
  }

  await db.transaction('rw', db.countries, db.places, async () => {
    await db.countries.bulkPut(countriesToInsert);
    await db.places.bulkPut(placesToInsert);
  });
};
