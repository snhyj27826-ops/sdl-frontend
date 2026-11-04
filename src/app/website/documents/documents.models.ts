export type DocumentCategory = 'laws' | 'statute' | 'finance' | 'program' | 'forms' | 'other';

export interface PublicDocument {
  _id: string;
  path: string;
  title: string;
  lastUpdated: string;
  format: string;
  category: DocumentCategory;
}
