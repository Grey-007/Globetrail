import { LocationRepository } from '../../domain/repositories/LocationRepository';
import { LocationLocalDataSource } from '../datasources/LocationLocalDataSource';
import { Result, success, failure } from '@/core/utils/Result';
import { DatabaseFailure, Failure } from '@/core/error/Failure';
import { Country } from '../../domain/entities/Country';
import { Place } from '../../domain/entities/Place';

export class LocationRepositoryImpl implements LocationRepository {
  constructor(private localDataSource: LocationLocalDataSource) {}

  async getCountries(): Promise<Result<Country[], Failure>> {
    try {
      const countries = await this.localDataSource.getCountries();
      return success(countries);
    } catch (error) {
      return failure(new DatabaseFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async getPlacesByCountry(countryUuid: string): Promise<Result<Place[], Failure>> {
    try {
      const places = await this.localDataSource.getPlacesByCountry(countryUuid);
      return success(places);
    } catch (error) {
      return failure(new DatabaseFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async getAllPlaces(): Promise<Result<Place[], Failure>> {
    try {
      const places = await this.localDataSource.getAllPlaces();
      return success(places);
    } catch (error) {
      return failure(new DatabaseFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async createCountry(countryData: Omit<Country, 'uuid' | 'createdDate' | 'updatedDate' | 'version' | 'isDeleted'>): Promise<Result<Country, Failure>> {
    try {
      const now = new Date();
      const newCountry: Country = {
        ...countryData,
        uuid: crypto.randomUUID(),
        createdDate: now,
        updatedDate: now,
        version: 1,
        isDeleted: false,
      };
      const result = await this.localDataSource.createCountry(newCountry);
      return success(result);
    } catch (error) {
      return failure(new DatabaseFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async updateCountry(country: Country): Promise<Result<Country, Failure>> {
    try {
      const updatedCountry: Country = {
        ...country,
        updatedDate: new Date(),
        version: country.version + 1,
      };
      const result = await this.localDataSource.updateCountry(updatedCountry);
      return success(result);
    } catch (error) {
      return failure(new DatabaseFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async deleteCountry(uuid: string): Promise<Result<void, Failure>> {
    try {
      const count = await this.localDataSource.countPlacesInCountry(uuid);
      if (count > 0) {
        return failure(new DatabaseFailure('Cannot delete country with saved places.'));
      }
      await this.localDataSource.deleteCountry(uuid);
      return success(undefined);
    } catch (error) {
      return failure(new DatabaseFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async createPlace(placeData: Omit<Place, 'uuid' | 'createdDate' | 'updatedDate' | 'version' | 'isDeleted'>): Promise<Result<Place, Failure>> {
    try {
      // Check for duplicates
      const placesInCountry = await this.localDataSource.getPlacesByCountry(placeData.countryUuid);
      if (placesInCountry.some(p => p.name.toLowerCase() === placeData.name.toLowerCase())) {
        return failure(new DatabaseFailure('A place with this name already exists in this country.'));
      }

      const now = new Date();
      const newPlace: Place = {
        ...placeData,
        uuid: crypto.randomUUID(),
        createdDate: now,
        updatedDate: now,
        version: 1,
        isDeleted: false,
      };
      const result = await this.localDataSource.createPlace(newPlace);
      return success(result);
    } catch (error) {
      return failure(new DatabaseFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async updatePlace(place: Place): Promise<Result<Place, Failure>> {
    try {
      // Check for duplicates if name changed
      const placesInCountry = await this.localDataSource.getPlacesByCountry(place.countryUuid);
      const duplicate = placesInCountry.find(
        p => p.name.toLowerCase() === place.name.toLowerCase() && p.uuid !== place.uuid
      );
      if (duplicate) {
        return failure(new DatabaseFailure('A place with this name already exists in this country.'));
      }

      const updatedPlace: Place = {
        ...place,
        updatedDate: new Date(),
        version: place.version + 1,
      };
      const result = await this.localDataSource.updatePlace(updatedPlace);
      return success(result);
    } catch (error) {
      return failure(new DatabaseFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async deletePlace(uuid: string): Promise<Result<void, Failure>> {
    try {
      await this.localDataSource.deletePlace(uuid);
      return success(undefined);
    } catch (error) {
      return failure(new DatabaseFailure(error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}
