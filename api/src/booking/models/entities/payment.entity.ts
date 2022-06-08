import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    card: string;

    @Column()
    expiaryDate: string;

    @Column()
    guard: number;

    @OneToOne(() => Booking, (booking) => booking.payment)
    booking: Booking;
}