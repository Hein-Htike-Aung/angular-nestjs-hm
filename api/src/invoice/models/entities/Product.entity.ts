import { PurchaseItem } from './purchase-item.entity';
import { Min } from 'class-validator';
import { Category } from './category.entity';
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

  @Column({ default: 0 })
  @Min(0)
  destroyed: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.product)
  purchaseItems: PurchaseItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
