import { Country } from '../../domain/entities/Country';
import { Place } from '../../domain/entities/Place';

export interface LocationLocalDataSource {
  getCountries(): Promise<Country[]>;
  getPlacesByCountry(countryUuid: string): Promise<Place[]>;
  getAllPlaces(): Promise<Place[]>;

  createCountry(country: Country): Promise<Country>;
  updateCountry(country: Country): Promise<Country>;
  deleteCountry(uuid: string): Promise<void>;
  countPlacesInCountry(countryUuid: string): Promise<number>;

  createPlace(place: Place): Promise<Place>;
  updatePlace(place: Place): Promise<Place>;
  deletePlace(uuid: string): Promise<void>;
}
