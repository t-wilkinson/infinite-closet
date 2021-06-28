import { StrapiProduct } from './product';

/**
 * Model definition for Designer
 */
export interface StrapiDesigner {
  id: string;
  name: string;
  slug: string;
  products: StrapiProduct[];
  notes?: string;
  description?: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}