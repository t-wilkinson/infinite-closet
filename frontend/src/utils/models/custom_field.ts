/**
 * Model definition for Custom_field
 */
export interface StrapiCustomField {
  id: string;
  title?: string;
  required?: boolean;
  options?: string;
  created_by: string;
}