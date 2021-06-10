/**
 * Model definition for Occasion
 */
export interface StrapiOccasion {
  id: string;
  name: string;
  slug: string;
  value?: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}