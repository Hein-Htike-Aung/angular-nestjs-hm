import { ROlE } from './user-role.enum';
import { SubDivision } from './subDivision.entity';
import { Position } from './position.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column() // timestamp in postgres
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

  @Column({nullable: true})
  username: string;

  @Column({select: false, nullable: true})
  password: string;

  @Column({ type: 'enum', enum: ROlE, default: ROlE.USER })
  role: ROlE;

  @Column({ type: 'bool', name: 'actvie', default: true })
  @Column({ name: 'actvie', default: true })
  is_active: boolean;
}
