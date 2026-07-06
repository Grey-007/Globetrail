import { create } from 'zustand';
import { Place } from '@/features/home/domain/entities/Place';
import { Country } from '@/features/home/domain/entities/Country';
import { searchRepository } from '@/core/di/injection';

interface SearchState {
  query: string;
  isSearching: boolean;
  localResults: { countries: Country[], places: Place[] };
  setQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  isSearching: false,
  localResults: { countries: [], places: [] },
  setQuery: (query) => {
    set({ query });
    get().performSearch(query);
  },
  performSearch: async (query) => {
    if (!query.trim()) {
      set({ localResults: { countries: [], places: [] }, isSearching: false });
      return;
    }
    set({ isSearching: true });
    const result = await searchRepository.searchLocal(query);
    if (result.success) {
      set({ localResults: result.data, isSearching: false });
    } else {
      set({ localResults: { countries: [], places: [] }, isSearching: false });
    }
  },
  clearSearch: () => {
    set({ query: '', localResults: { countries: [], places: [] }, isSearching: false });
  }
}));
