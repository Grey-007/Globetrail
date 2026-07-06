import { GlobeTrailDatabase, db } from '../database/localDatabase';
import { LocationLocalDataSourceImpl } from '@/features/home/data/datasources/LocationLocalDataSourceImpl';
import { LocationRepositoryImpl } from '@/features/home/data/repositories/LocationRepositoryImpl';
import { seedDatabase } from '../database/seedData';

// Repositories
export const locationLocalDataSource = new LocationLocalDataSourceImpl(db);
export const locationRepository = new LocationRepositoryImpl(locationLocalDataSource);

export const initDatabase = async () => {
  await seedDatabase(db);
};
