import { StrapiFile } from './file';

/**
 * Model definition for Review
 */
export interface StrapiReview {
  id: string;
  fit?: "small" | "true" | "large";
  rating?: number;
  heading: string;
  message: string;
  images: StrapiFile[];
  created_by: string;
  updated_at: string;
  published_at: string;
}