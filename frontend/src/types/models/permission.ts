import { StrapiRole } from './role';

/**
 * Model definition for permission
 */
export interface StrapiPermission {
  id: string;
  type: string;
  controller: string;
  action: string;
  enabled: boolean;
  policy?: string;
  role?: StrapiRole;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}