/**
 * Model definition for Contact
 */
export interface StrapiContact {
  id: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  subscribed?: boolean;
  metadata?: { [key: string]: any };
  created_by: string;
  updated_at: string;
  published_at: string;
}