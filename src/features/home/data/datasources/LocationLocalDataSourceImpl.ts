import { LocationLocalDataSource } from './LocationLocalDataSource';
import { Country } from '../../domain/entities/Country';
import { Place } from '../../domain/entities/Place';
import { GlobeTrailDatabase } from '@/core/database/localDatabase';

export class LocationLocalDataSourceImpl implements LocationLocalDataSource {
  constructor(private db: GlobeTrailDatabase) {}

  async getCountries(): Promise<Country[]> {
    return this.db.countries.toArray();
  }

  async getPlacesByCountry(countryUuid: string): Promise<Place[]> {
    return this.db.places.where('countryUuid').equals(countryUuid).toArray();
  }

  async getAllPlaces(): Promise<Place[]> {
    return this.db.places.toArray();
  }

  async createCountry(country: Country): Promise<Country> {
    await this.db.countries.add(country);
    return country;
  }

  async updateCountry(country: Country): Promise<Country> {
    await this.db.countries.put(country);
    return country;
  }

  async deleteCountry(uuid: string): Promise<void> {
    await this.db.countries.delete(uuid);
  }

  async countPlacesInCountry(countryUuid: string): Promise<number> {
    return this.db.places.where('countryUuid').equals(countryUuid).count();
  }

  async createPlace(place: Place): Promise<Place> {
    await this.db.places.add(place);
    return place;
  }

  async updatePlace(place: Place): Promise<Place> {
    await this.db.places.put(place);
    return place;
  }

  async deletePlace(uuid: string): Promise<void> {
    await this.db.places.delete(uuid);
  }
}
