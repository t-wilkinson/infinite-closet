import { StrapiProduct } from './product';

/**
 * Model definition for Designer
 */
export interface StrapiDesigner {
  id: string;
  name: string;
  slug: string;
  products: StrapiProduct[];
  description?: string;
  created_by: string;
  updated_at: string;
}