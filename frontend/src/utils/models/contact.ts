/**
 * Model definition for Contact
 */
export interface StrapiContact {
  id: string;
  metadata?: { [key: string]: any };
  context?: "waitlist" | "launch_party" | "newsletter";
  contact?: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}