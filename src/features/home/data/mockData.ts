export type PlacePriority = 'high' | 'medium' | 'low';
export type PlaceStatus = 'planning' | 'visited';

export interface MockPlace {
  id: string;
  name: string;
  category: string;
  isFavorite: boolean;
  status: PlaceStatus;
  priority: PlacePriority;
  thumbnail?: string;
}

export interface MockCountry {
  id: string;
  name: string;
  flag: string;
  places: MockPlace[];
}

export const mockCountries: MockCountry[] = [
  {
    id: 'jp',
    name: 'Japan',
    flag: '🇯🇵',
    places: [
      {
        id: 'jp-1',
        name: 'Tokyo',
        category: 'City',
        isFavorite: true,
        status: 'planning',
        priority: 'high',
      },
      {
        id: 'jp-2',
        name: 'Kyoto',
        category: 'Culture',
        isFavorite: true,
        status: 'visited',
        priority: 'high',
      },
      {
        id: 'jp-3',
        name: 'Osaka',
        category: 'Food',
        isFavorite: false,
        status: 'planning',
        priority: 'medium',
      },
      {
        id: 'jp-4',
        name: 'Mount Fuji',
        category: 'Nature',
        isFavorite: true,
        status: 'planning',
        priority: 'high',
      },
      {
        id: 'jp-5',
        name: 'Nara',
        category: 'Nature',
        isFavorite: false,
        status: 'planning',
        priority: 'low',
      },
    ],
  },
  {
    id: 'no',
    name: 'Norway',
    flag: '🇳🇴',
    places: [
      {
        id: 'no-1',
        name: 'Oslo',
        category: 'City',
        isFavorite: false,
        status: 'visited',
        priority: 'medium',
      },
      {
        id: 'no-2',
        name: 'Lofoten',
        category: 'Nature',
        isFavorite: true,
        status: 'planning',
        priority: 'high',
      },
      {
        id: 'no-3',
        name: 'Bergen',
        category: 'City',
        isFavorite: false,
        status: 'planning',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'in',
    name: 'India',
    flag: '🇮🇳',
    places: [
      {
        id: 'in-1',
        name: 'Leh',
        category: 'Nature',
        isFavorite: true,
        status: 'planning',
        priority: 'high',
      },
      {
        id: 'in-2',
        name: 'Hampi',
        category: 'Culture',
        isFavorite: false,
        status: 'visited',
        priority: 'medium',
      },
      {
        id: 'in-3',
        name: 'Darjeeling',
        category: 'Nature',
        isFavorite: true,
        status: 'planning',
        priority: 'high',
      },
      {
        id: 'in-4',
        name: 'Meghalaya',
        category: 'Nature',
        isFavorite: true,
        status: 'planning',
        priority: 'high',
      },
    ],
  },
];
