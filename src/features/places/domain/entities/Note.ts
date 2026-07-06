export interface Note {
  readonly uuid: string;
  readonly placeUuid: string;
  readonly content: string;
  readonly createdDate: Date;
  readonly updatedDate: Date;
  readonly version: number;
  readonly isDeleted: boolean;
}
