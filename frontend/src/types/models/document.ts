/**
 * Model definition for Document
 */
export interface StrapiDocument {
  id: string;
  content?: string;
  name: string;
  slug?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}