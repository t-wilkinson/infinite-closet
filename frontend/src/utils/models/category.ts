import { StrapiProduct } from './product';

/**
 * Model definition for category
 */
export interface StrapiCategory {
  id: string;
  name?: string;
  slug?: string;
  products: StrapiProduct[];
  created_by: string;
}