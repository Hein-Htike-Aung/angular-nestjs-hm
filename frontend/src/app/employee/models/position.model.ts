import { Employee } from './employee.model';

export interface Position {
  id: number;

  name: string;
  details: string;

  employees: Employee[];
}
