/**
 * Model definition for Document
 */
export interface StrapiDocument {
  id: string;
  content?: string;
  name: string;
  slug?: string;
  created_by: string;
}