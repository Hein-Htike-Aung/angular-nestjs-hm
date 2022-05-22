import { Division } from "./division.model";
import { Employee } from "./employee.model";

export interface SubDivision {
    id: number;

    name: string;
  
    division: Division;
  
    employees: Employee[];

    createdAt: Date;
    updatedAt: Date;
}

export interface SubDivisionRequestPayload {

    name: string;
    divisionId: number;
  
}