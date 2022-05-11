import { Employee } from './employee.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class SubDivision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @OneToMany(() => Employee, (employee) => employee.subDivision)
  employees: Employee[];
} 
