/**
 * Model definition for size
 */
export interface StrapiSize {
  id: string;
  size?: "XXS" | "XS" | "S" | "M" | "L" | "XL" | "_2XL" | "ONESIZE";
  sizeRange?: "XS" | "S" | "M" | "L" | "XL" | "_2XL";
  quantity: number;
  units?: "cm" | "inches";
  hips?: number;
  waist?: number;
  bust?: number;
  armpitWidth?: number;
  lengthFromShoulder?: number;
  created_by: string;
  updated_at: string;
  published_at: string;
}