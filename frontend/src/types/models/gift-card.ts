/**
 * Model definition for Gift Card
 */
export interface StrapiGiftCard {
  id: string;
  value: number;
  code?: string;
  paymentIntent?: string;
  senderName?: string;
  senderEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
  deliveryDate?: Date;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}