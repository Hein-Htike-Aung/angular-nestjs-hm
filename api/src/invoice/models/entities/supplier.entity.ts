import { Invoice } from './invoice.entity';
import { Min } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: 0 })
  @Min(0)
  totalAmount: number;

  @Column({ default: 0 })
  @Min(0)
  dueAmount: number;

  @Column({ default: 0 })
  @Min(0)
  paidAmount: number;

  @OneToMany(() => Invoice, (invoice) => invoice.supplier)
  invoices: Invoice[];
}
