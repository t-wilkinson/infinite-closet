/**
 * Model definition for Bloomino notification
 */
export interface StrapiBloominoNotification {
  id: string;
  requestId?: string;
  code?: string;
  message?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}