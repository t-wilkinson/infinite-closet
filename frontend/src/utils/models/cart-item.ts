import { StrapiProduct } from './product';

/**
 * Model definition for Cart Item
 */
export interface StrapiCart Item {
  id: string;
  product?: StrapiProduct;
  size: string;
  quantity: number;
  created_by: string;
}