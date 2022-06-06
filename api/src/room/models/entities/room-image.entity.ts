import { RoomType } from './room-type.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class RoomImage {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => RoomType, (roomType) => roomType.roomImages)
  room_type: RoomType;
}
