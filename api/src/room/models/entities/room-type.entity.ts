import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoomImage } from './room-image.entity';
import { Room } from './room.entity';

@Entity()
export class RoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  roomType: string;

  @OneToMany(() => RoomImage, (roomImage) => roomImage.room_type)
  roomImages: RoomImage[];

  @OneToMany(() => Room, (room) => room.room_type)
  rooms: Room[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
