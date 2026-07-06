export interface Tag {
  readonly uuid: string;
  readonly name: string;
  readonly colorHex?: string;
  readonly iconName?: string;
  readonly createdDate: Date;
  readonly version: number;
  readonly isDeleted: boolean;
}
