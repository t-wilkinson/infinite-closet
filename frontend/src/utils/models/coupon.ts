/**
 * Model definition for Coupon
 */
export interface StrapiCoupon {
  id: string;
  type: "percent_off" | "amount_off";
  amount: number;
  code: string;
  context?: "checkout" | "launch-party";
  maxUses: number;
  expiration?: Date;
  created_by: string;
  updated_at: string;
  published_at: string;
}