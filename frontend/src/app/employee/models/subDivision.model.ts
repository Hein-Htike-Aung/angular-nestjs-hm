import { Division } from "./division.model";
import { Employee } from "./employee.model";

export interface SubDivision {
    id: number;

    name: string;
  
    division: Division;
  
    employees: Employee[];
}