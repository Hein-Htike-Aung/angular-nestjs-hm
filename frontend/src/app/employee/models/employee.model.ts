import { User } from '../../auth/models/user.model';
import { Position } from './position.model';
import { SubDivision } from './subDivision.model';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface Employee {
  id: number;

  name: string;
  familyMember: string[];

  contact: {
    phone: string;
    email: string;
  };

  dob: Date;

  hireDate: Date;

  gender: GENDER;

  position: Position;

  subDivision: SubDivision;

  image: string;

  user: User;

  //   invoices: Invoice[];
}
