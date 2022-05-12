import { Employee } from './employee.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  details: string;

  @OneToMany(() => Employee, (employee) => employee.position)
  employees: Employee[];
}
