import { Invoice } from './../../../invoice/models/entities/invoice.entity';
import { SubDivision } from './subDivision.entity';
import { Position } from './position.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../auth/models/entities/user.entity';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'simple-array', default: [] })
  familyMember: string[];

  @Column({ type: 'simple-json', unique: true })
  contact: {
    phone: string;
    email: string;
  };

  @Column({ type: 'date' }) // timestamp in date
  dob: Date;

  @CreateDateColumn() // timestamp in postgres
  hireDate: Date;

  @Column({ type: 'enum', enum: GENDER })
  gender: GENDER;

  @ManyToOne(() => Position, (position) => position.employees)
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @ManyToOne(() => SubDivision, (subdivistion) => subdivistion.employees)
  @JoinColumn({ name: 'subdivision_id' })
  subDivision: SubDivision;

  @Column({ nullable: true })
  image: string;

  @OneToOne(() => User, (user) => user.employee)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Invoice, (invoice) => invoice.employee)
  invoices: Invoice[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
