import { Invoice } from './invoice.entity';
import { Min } from 'class-validator';
import { Product } from './Product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PurchaseItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Min(0)
  quantity: number;

  @Column()
  @Min(0)
  rate: number;

  @ManyToOne(() => Product, (product) => product.purchaseItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Invoice, (invoice) => invoice.purchaseItems,{
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;
}
