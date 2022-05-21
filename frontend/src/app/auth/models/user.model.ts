import { Employee } from '../../employee/models/employee.model';

export enum ROLE {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  USER = 'USER',
}

export interface User {
  id: number;

  username: string;
  password: string;

  role: ROLE;

  is_active: boolean;

  createdAt: Date;

  updatedAt: Date;

  employee: Employee;
}
