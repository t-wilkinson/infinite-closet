/**
 * Model definition for Weather
 */
export interface StrapiWeather {
  id: string;
  name: string;
  slug: string;
  value?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}