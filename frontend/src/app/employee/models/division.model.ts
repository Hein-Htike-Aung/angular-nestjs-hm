import { SubDivision } from "./subDivision.model";

export interface Division {
    id: number;

    name: string;

    subDivisions: SubDivision[];
    
    createdAt: Date;
    updatedAt: Date;
}