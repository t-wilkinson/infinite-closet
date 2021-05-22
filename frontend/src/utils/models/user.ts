import { StrapiAddress } from './address';
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
  orders: any[];
  order?: any;
  created_by: string;
}