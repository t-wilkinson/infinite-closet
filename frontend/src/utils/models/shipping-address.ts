/**
 * Model definition for Shipping Address
 */
export interface StrapiShipping Address {
  id: string;
  first_name?: string;
  last_name: string;
  address: string;
  locality_name: string;
  town: string;
  postcode: string;
  created_by: string;
}
