/**
 * Model definition for Category
 */
export interface StrapiCategory {
  id: string;
  name: string;
  slug: string;
  value?: string;
  categories: StrapiCategory[];
  created_by: string;
  updated_at: string;
  published_at: string;
}