export type Priority = 'high' | 'medium' | 'low';
export type PlaceStatus = 'planning' | 'booked' | 'visited' | 'archived';

/**
 * Domain entity representing a Place within a Country.
 * Immutable by design.
 */
export interface Place {
  /** Unique identifier for the place */
  readonly uuid: string;
  /** Foreign key mapping to the parent Country */
  readonly countryUuid: string;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly address?: string;
  readonly externalId?: string;
  readonly category: string; // Added to map mock data
  readonly description: string;
  readonly notes: string; // Used for markdown travel journal
  
  // Travel Journal specific fields
  readonly visitDate?: Date;
  readonly futureTripDate?: Date;
  readonly bestTimeToVisit?: string;
  readonly estimatedBudget?: string;
  readonly travelCompanions?: string[]; // future-ready
  
  readonly priority: Priority;
  readonly status: PlaceStatus;
  readonly isFavorite: boolean;
  readonly createdDate: Date;
  readonly updatedDate: Date;
  readonly thumbnailPath?: string;
  readonly colorMarker?: string;
  readonly rating?: number;
  /** Incremental version for optimistic concurrency / sync */
  readonly version: number;
  /** Soft delete flag */
  readonly isDeleted: boolean;
}

