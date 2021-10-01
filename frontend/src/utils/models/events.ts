import { StrapiUser } from './user';

/**
 * Model definition for Events
 */
export interface StrapiEvents {
  id: string;
  context?: string;
  data?: { [key: string]: any };
  user?: StrapiUser;
  session?: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}