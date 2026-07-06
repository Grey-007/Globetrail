import { Result } from '@/core/utils/Result';
import { Failure } from '@/core/error/Failure';
import { Place } from '@/features/home/domain/entities/Place';
import { Country } from '@/features/home/domain/entities/Country';

export interface SearchResult {
  countries: Country[];
  places: Place[];
}

export interface SearchRepository {
  searchLocal(query: string): Promise<Result<SearchResult, Failure>>;
}
