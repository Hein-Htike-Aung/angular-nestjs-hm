import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Division {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;
}