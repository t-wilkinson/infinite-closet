/**
 * Model definition for size
 */
export interface StrapiSize {
  id: string;
  size?: "XXS" | "XS" | "S" | "M" | "L" | "XL" | "_2XL" | "_3XL" | "_4XL" | "_5XL" | "_6XL";
  sizeRange?: "XS" | "S" | "M" | "L" | "XL" | "_2XL" | "_3XL" | "_4XL" | "_5XL" | "_6XL";
  quantity: number;
  units?: "cm";
  hips?: number;
  waist?: number;
  bust?: number;
  armpitWidth?: number;
  lengthFromShoulder?: number;
  created_by: string;
  updated_at: string;
  published_at: string;
}