export type AttachmentType = 'pdf' | 'ticket' | 'booking' | 'document' | 'other';

export interface Attachment {
  readonly uuid: string;
  readonly placeUuid: string;
  readonly name: string;
  readonly type: AttachmentType;
  readonly filePath: string; // Base64 or local Object URL for offline mode
  readonly fileSize: number;
  readonly createdDate: Date;
  readonly version: number;
  readonly isDeleted: boolean;
}
