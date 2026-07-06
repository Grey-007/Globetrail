import { SearchRepository, SearchResult } from '../../domain/repositories/SearchRepository';
import { Result, success, failure } from '@/core/utils/Result';
import { Failure, DatabaseFailure } from '@/core/error/Failure';
import { db } from '@/core/database/localDatabase';

export class LocalSearchRepositoryImpl implements SearchRepository {
  async searchLocal(query: string): Promise<Result<SearchResult, Failure>> {
    try {
      const lowerQuery = query.toLowerCase();
      
      const countries = await db.countries
        .filter(c => c.countryName.toLowerCase().includes(lowerQuery))
        .toArray();
      
      const places = await db.places
        .filter(p => 
          p.name.toLowerCase().includes(lowerQuery) || 
          (p.notes || '').toLowerCase().includes(lowerQuery)
        )
        .toArray();
        
      return success({ countries, places });
    } catch (e: any) {
      return failure(new DatabaseFailure(e.message));
    }
  }
}


