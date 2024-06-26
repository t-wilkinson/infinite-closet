/**
 * Model definition for Address
 */
export interface StrapiAddress {
  id: string;
  fullName?: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  town: string;
  postcode: string;
  mobileNumber?: string;
  deliveryInstructions?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}