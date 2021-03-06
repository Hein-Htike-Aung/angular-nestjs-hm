import { Booking } from './../../../booking/models/entities/booking.entity';
import { RoomType } from './room-type.entity';
import { RoomImage } from './room-image.entity';
import {
  Column,
  Entity,
  MinKey,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingDetials } from '../../../booking/models/entities/booking-details.entity';

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  room_number: String;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  room_type: RoomType;

  @Column()
  size: number;

  @Column()
  bed_numbers: number;

  @Column({ type: 'enum', enum: RoomStatus })
  room_status: RoomStatus;

  @Column()
  price: number;

  @Column({nullable: true})
  description: string;

  @OneToMany(() => BookingDetials, (bookingDetails) => bookingDetails.room)
  bookingDetails: BookingDetials[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
