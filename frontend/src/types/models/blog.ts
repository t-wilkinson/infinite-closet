import { StrapiFile } from './file';

/**
 * Model definition for Blog
 */
export interface StrapiBlog {
  id: string;
  content?: string;
  title: string;
  slug?: string;
  image?: StrapiFile;
  subtitle?: string;
  thumbnail?: StrapiFile;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}