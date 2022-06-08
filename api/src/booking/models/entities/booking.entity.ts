import { Payment } from './payment.entity';
import { Customer } from './customer.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../../../room/models/entities/room.entity';

export enum BookingType {
  Advance = 'Advance',
  Instant = 'Instant',
  Groups = 'Groups',
  Wedding = 'Wedding',
  Seminar = 'Seminar'
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  check_in_date: Date;

  @Column({ type: 'date' })
  check_out_date: Date;

  @Column()
  paid_amount: number;

  @Column({nullable: true, default: 0})
  due_amount: number;

  @Column()
  total: number;

  @Column()
  bookingType: BookingType;

  @ManyToOne(() => Customer, (customer) => customer.bookings)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({nullable: true})
  remark: string;

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment;
}
