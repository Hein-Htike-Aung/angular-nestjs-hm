import { PurchaseItem } from './purchase-item.entity';
import { Min } from 'class-validator';
import { Category } from './category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  @Min(0)
  quantity: number;

  @Column({ type: 'bool', name: 'active', default: true })
  is_active: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.product)
  purchaseItems: PurchaseItem[];
}
