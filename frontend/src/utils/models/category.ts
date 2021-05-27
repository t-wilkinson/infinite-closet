/**
 * Model definition for Category
 */
export interface StrapiCategory {
  id: string;
  name: string;
  slug: string;
  value?: string;
  created_by: string;
  updated_at: string;
}