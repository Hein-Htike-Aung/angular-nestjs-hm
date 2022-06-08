import { Booking } from './booking.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GENDER } from '../../../employee/models/entities/employee.entity';

export enum Nationality {
    Native ='Native',
    Foreigner = 'Foreigner'
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'simple-json', unique: true })
  contact: {
    phone: string;
    email: string;
  };

  @Column({ nullable: true })
  profession: string;

  @Column()
  nationality: Nationality;

  @Column({nullable: true})
  address: string;

  @Column()
  id_passport: string;

  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
