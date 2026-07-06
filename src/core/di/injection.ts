import { GlobeTrailDatabase, db } from '../database/localDatabase';
import { LocationLocalDataSourceImpl } from '@/features/home/data/datasources/LocationLocalDataSourceImpl';
import { LocationRepositoryImpl } from '@/features/home/data/repositories/LocationRepositoryImpl';
import { LocalSearchRepositoryImpl } from '@/features/search/data/repositories/LocalSearchRepositoryImpl';
import { seedDatabase } from '../database/seedData';

// Repositories
export const locationLocalDataSource = new LocationLocalDataSourceImpl(db);
export const locationRepository = new LocationRepositoryImpl(locationLocalDataSource);
export const searchRepository = new LocalSearchRepositoryImpl();


export const initDatabase = async () => {
  await seedDatabase(db);
};
