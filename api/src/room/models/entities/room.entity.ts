import { RoomImage } from './room-image.entity';
import {
  Column,
  Entity,
  MinKey,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

export enum RoomType {
  Double_Deluxe_Room = 'Double Deluxe Room',
  VIP_Guest = 'VIP-Guest',
  VIP = 'VIP',
  Triple_Room = 'Triple Room',
  Single_Room = 'Single Room',
  Twin_Room = 'Twin Room',
}

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

  @Column({ type: 'enum', enum: RoomType })
  room_type: RoomType;

  @Column()
  size: number;

  @Column()
  bed_numbers: number;

  @Column({ type: 'enum', enum: RoomStatus })
  room_status: RoomStatus;

  @Column()
  price: number;

  @OneToMany(() => RoomImage, (roomImage) => roomImage.room)
  roomImages: RoomImage[];
}
