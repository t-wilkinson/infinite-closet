import { StrapiAddress } from './address';
import { StrapiCart Item } from './cart-item';
import { StrapiOrder } from './order';
import { StrapiRole } from './role';

/**
 * Model definition for user
 */
export interface StrapiUser {
  id: string;
  username: string;
  email: string;
  provider?: string;
  password?: string;
  resetPasswordToken?: string;
  confirmationToken?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: StrapiRole;
  customer?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  addresses: StrapiAddress[];
  orders: StrapiOrder[];
  cart: StrapiCart Item[];
  created_by: string;
}