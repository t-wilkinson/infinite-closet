/**
 * Model definition for Contact
 */
export interface StrapiContact {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  subscribed?: boolean;
  metadata?: { [key: string]: any };
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}