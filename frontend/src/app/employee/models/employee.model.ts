import { ROLE, User } from '../../auth/models/user.model';
import { Position } from './position.model';
import { SubDivision } from './subDivision.model';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

class ContactInfo {
  email: string;

  phone: string;
}

export interface Employee {
  id: number;

  name: string;
  familyMember: string[];

  contact: ContactInfo;

  address: string;

  dob: Date;

  hireDate: Date;

  gender: GENDER;

  position: Position;

  subDivision: SubDivision;

  image: string;

  user: User;

  //   invoices: Invoice[];

  createdAt: Date;

  updatedAt: Date;
}

export interface EmployeeRequestPayload {
  name: string;

  positionId: number;

  subDivisonId: number;

  contact: ContactInfo;

  address: string;
  
  familyMember?: string[];

  dob: Date;

  hireDate: Date;

  gender: GENDER;

  image?: FormData;

  role: ROLE;

  username?: string;

  password?: string;

  is_Active?: boolean;
}
