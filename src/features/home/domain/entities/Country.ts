export interface Country {
  readonly uuid: string;
  readonly isoCode: string;
  readonly countryName: string;
  readonly flagEmoji: string;
  readonly continent: string;
  readonly createdDate: Date;
  readonly updatedDate: Date;
  readonly version: number;
  readonly isDeleted: boolean;
}
