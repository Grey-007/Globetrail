import Dexie, { type Table } from 'dexie';
import type { Country } from '@/features/home/domain/entities/Country';
import type { Place } from '@/features/home/domain/entities/Place';
import type { Tag } from '@/features/places/domain/entities/Tag';
import type { Photo } from '@/features/places/domain/entities/Photo';
import type { Note } from '@/features/places/domain/entities/Note';
import type { Attachment } from '@/features/places/domain/entities/Attachment';
import type { Settings } from '@/features/settings/domain/entities/Settings';

export class GlobeTrailDatabase extends Dexie {
  countries!: Table<Country, string>;
  places!: Table<Place, string>;
  tags!: Table<Tag, string>;
  photos!: Table<Photo, string>;
  notes!: Table<Note, string>;
  attachments!: Table<Attachment, string>;
  settings!: Table<Settings, number>;

  constructor() {
    super('GlobeTrailDatabase');
    
    // Schema definition for Version 1
    this.version(1).stores({
      countries: 'uuid, isoCode',
      places: 'uuid, countryUuid, status, priority, isFavorite',
      tags: 'uuid, name',
      photos: 'uuid, placeUuid',
      notes: 'uuid, placeUuid',
      settings: 'id'
    });

    // Schema definition for Version 2
    this.version(2).stores({
      attachments: 'uuid, placeUuid'
    });
  }
}


export const db = new GlobeTrailDatabase();

