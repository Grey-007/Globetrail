export interface Photo {
  readonly uuid: string;
  readonly placeUuid: string;
  readonly filePath: string;
  readonly caption?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly isCover: boolean;
  readonly createdDate: Date;
  readonly version: number;
  readonly isDeleted: boolean;
}
