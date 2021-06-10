/**
 * Model definition for Address
 */
export interface StrapiAddress {
  id: string;
  address: string;
  town: string;
  postcode: string;
  firstName: string;
  lastName: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}