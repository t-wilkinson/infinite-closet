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
  lastName?: string;
  customer?: string;
  addresses: StrapiAddress[];
  carts: StrapiCart Item[];
  orders: StrapiOrder[];
  phoneNumber?: string;
  created_by: string;
}