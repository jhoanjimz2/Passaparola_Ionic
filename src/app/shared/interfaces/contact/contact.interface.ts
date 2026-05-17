import { Company } from '../company/company.interface';
import { User } from '../user/user.interface';

export interface Contact {
  name?: string;
  phone?: string;
  user?: User;
  company?: Company;
  isBussines?: boolean;
}
