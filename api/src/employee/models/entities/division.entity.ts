import { SubDivision } from './subDivision.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => SubDivision, (subdivision) => subdivision.division)
  subDivisions: SubDivision[];
}
