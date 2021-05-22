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
  shortRentalPrice?: number;
  longRentalPrice?: number;
  retailPrice?: number;
  purchasePrice?: number;
  images: StrapiFile[];
  colors?: string;
  fits?: string;
  occasions?: string;
  styles?: string;
  weather?: string;
  categories?: string;
  sizes: any[];
  details?: string;
  stylistNotes?: string;
  created_by: string;
}