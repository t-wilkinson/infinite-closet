import { StrapiPermission } from './permission';
import { StrapiUser } from './user';

/**
 * Model definition for role
 */
export interface StrapiRole {
  id: string;
  name: string;
  description?: string;
  type?: string;
  permissions: StrapiPermission[];
  users: StrapiUser[];
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}