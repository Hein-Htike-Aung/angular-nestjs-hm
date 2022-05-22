import { Division } from './division.entity';
import { Employee } from './employee.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SubDivision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Division, (division) => division.subDivisions)
  @JoinColumn({name: 'division_id'})
  division: Division;

  @OneToMany(() => Employee, (employee) => employee.subDivision)
  employees: Employee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
