import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "../../../room/models/entities/room.entity";

@Entity()
export class BookingDetials {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Room, (room) => room.bookingDetails)
    room: Room;

    @Column()
    personCount: number;
}