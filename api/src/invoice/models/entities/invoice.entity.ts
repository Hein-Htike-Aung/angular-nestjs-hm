import { PurchaseItem } from './purchase-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './../../../employee/models/entities/employee.entity';
import { Supplier } from './supplier.entity';

export enum PaymentStatus {
  Paid = 'Paid',
  Unpaid = 'Unpaid',
}

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  purchaseDate: Date;

  @ManyToOne(() => Supplier, (supplier) => supplier.invoices)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Employee, (employee) => employee.invoices)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  details: string;

  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.invoice, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  purchaseItems: PurchaseItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
