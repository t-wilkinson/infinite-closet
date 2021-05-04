import { StrapiDesigner } from './designer';
import { StrapiFile } from './file';

/**
 * Model definition for product
 */
export interface StrapiProduct {
  id: string;
  designer?: StrapiDesigner;
  name: string;
  slug: string;
  description: string;
  stylist_notes: string;
  rental_price: number;
  retail_price?: number;
  purchase_price?: number;
  images: StrapiFile[];
  colors?: string;
  fits?: string;
  occasions?: string;
  styles?: string;
  weather?: string;
  categories?: string;
  sizes: any[];
  created_by: string;
}