import { StrapiUser } from './user';
import { StrapiWardrobeTag } from './wardrobe-tag';

/**
 * Model definition for Wardrobe
 */
export interface StrapiWardrobe {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  visible?: boolean;
  user?: StrapiUser;
  tags: StrapiWardrobeTag[];
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}