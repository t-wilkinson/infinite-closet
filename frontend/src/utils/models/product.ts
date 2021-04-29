import { StrapiCategory } from './category';
import { StrapiDesigner } from './designer';
import { StrapiFile } from './file';

/**
 * Model definition for product
 */
export interface StrapiProduct {
  id: string;
  categories: StrapiCategory[];
  designer?: StrapiDesigner;
  name: string;
  slug: string;
  description: string;
  stylistnotes: string;
  rentalprice: number;
  retailprice?: number;
  purchaseprice?: number;
  images: StrapiFile[];
  colors?: string;
  fits?: string;
  occasions?: string;
  styles?: string;
  created_by: string;
}