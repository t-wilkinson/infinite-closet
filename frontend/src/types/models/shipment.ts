/**
 * Model definition for Shipment
 */
export interface StrapiShipment {
  id: string;
  shippingStatus?: "normal" | "delayed";
  shipmentId?: string;
  shippingClass?: "one" | "two";
  status?: "confirmed" | "shipped" | "start" | "end" | "cleaning" | "completed";
  confirmed?: string;
  shipped?: string;
  start?: string;
  end?: string;
  cleaning?: string;
  completed?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  published_at: string;
}