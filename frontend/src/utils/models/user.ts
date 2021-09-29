import { StrapiAddress } from './address';
import { StrapiEvents } from './events';
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
  chestSize?: string;
  hipsSize?: string;
  waistSize?: string;
  dressSize?: string;
  height?: string;
  weight?: string;
  dateOfBirth?: string;
  event?: StrapiEvents;
  created_by: string;
  updated_at: string;
  published_at: string;
}