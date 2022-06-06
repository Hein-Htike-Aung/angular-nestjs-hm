import { RoomType } from './room-type.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class RoomImage {
  
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ nullable: true })
  private image: string;

  @ManyToOne(() => RoomType, (roomType) => roomType.roomImages)
  room_type: RoomType;
}
