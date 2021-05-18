/**
 * Model definition for Address
 */
export interface StrapiAddress {
  id: string;
  lastName: string;
  address: string;
  localityName: string;
  town: string;
  postcode: string;
  created_by: string;
}