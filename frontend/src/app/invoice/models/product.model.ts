import { Category } from './category.model';
export interface Product {
  id: number;

  name: string;

  quantity: number;

  destroyed: number;

  category: Category;

  is_active: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface ProductRequestPayload {
  id: number;

  name: string;

  quantity: number;

  is_active: boolean;

  categoryId: number;
}
