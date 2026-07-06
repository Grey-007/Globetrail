import { Result } from '@/core/utils/Result';
import { Failure } from '@/core/error/Failure';
import { Country } from '../entities/Country';
import { Place } from '../entities/Place';

/**
 * LocationRepository
 * 
 * Abstract repository interface for accessing country and place data.
 * Adheres to Clean Architecture principles by decoupling domain logic from data sources.
 */
export interface LocationRepository {
  /**
   * Retrieves all countries saved in the database.
   */
  getCountries(): Promise<Result<Country[], Failure>>;
  
  /**
   * Retrieves all places associated with a specific country UUID.
   */
  getPlacesByCountry(countryUuid: string): Promise<Result<Place[], Failure>>;
  
  /**
   * Retrieves all places saved in the database across all countries.
   */
  getAllPlaces(): Promise<Result<Place[], Failure>>;

  // Country Management
  createCountry(country: Omit<Country, 'uuid' | 'createdDate' | 'updatedDate' | 'version' | 'isDeleted'>): Promise<Result<Country, Failure>>;
  updateCountry(country: Country): Promise<Result<Country, Failure>>;
  deleteCountry(uuid: string): Promise<Result<void, Failure>>;

  // Place Management
  createPlace(place: Omit<Place, 'uuid' | 'createdDate' | 'updatedDate' | 'version' | 'isDeleted'>): Promise<Result<Place, Failure>>;
  updatePlace(place: Place): Promise<Result<Place, Failure>>;
  deletePlace(uuid: string): Promise<Result<void, Failure>>;
}

