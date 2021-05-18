import { StrapiProduct } from './product';

/**
 * Model definition for Cart Item
 */
export interface StrapiCart Item {
  id: string;
  product?: StrapiProduct;
  quantity?: number;
  size: string;
  rentalLength?: "short" | "long";
  created_by: string;
}