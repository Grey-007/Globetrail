import { db } from '@/core/database/localDatabase';

export class BackupManager {
  static async exportData(): Promise<string> {
    const data = {
      countries: await db.countries.toArray(),
      places: await db.places.toArray(),
      tags: await db.tags.toArray(),
      photos: await db.photos.toArray(),
      notes: await db.notes.toArray(),
      attachments: await db.attachments.toArray(),
      settings: await db.settings.toArray(),
    };
    return JSON.stringify(data, null, 2);
  }

  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      await db.transaction('rw', [db.countries, db.places, db.tags, db.photos, db.notes, db.attachments, db.settings], async () => {
        if (data.countries) {
          await db.countries.clear();
          await db.countries.bulkAdd(data.countries);
        }
        if (data.places) {
          await db.places.clear();
          await db.places.bulkAdd(data.places);
        }
        if (data.tags) {
          await db.tags.clear();
          await db.tags.bulkAdd(data.tags);
        }
        if (data.photos) {
          await db.photos.clear();
          await db.photos.bulkAdd(data.photos);
        }
        if (data.notes) {
          await db.notes.clear();
          await db.notes.bulkAdd(data.notes);
        }
        if (data.attachments) {
          await db.attachments.clear();
          await db.attachments.bulkAdd(data.attachments);
        }
        if (data.settings) {
          await db.settings.clear();
          await db.settings.bulkAdd(data.settings);
        }
      });
    } catch (e) {
      console.error("Failed to import data", e);
      throw e;
    }
  }
}
