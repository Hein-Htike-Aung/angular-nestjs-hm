import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class RoomImage {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ nullable: true })
  private image: string;

  @ManyToOne(() => Room, (room) => room.roomImages)
  room: Room;
}
