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
  oneSizeStart?: "XXS" | "XS" | "S" | "M" | "L" | "XL" | "_2XL";
  oneSizeEnd?: "XS" | "S" | "M" | "L" | "XL" | "_2XL";
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}