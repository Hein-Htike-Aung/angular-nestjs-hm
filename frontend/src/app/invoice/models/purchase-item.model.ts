import { Invoice } from './invoice.model';
import { Product } from './product.model';

export interface PurchaseItem {
  id: number;

  quantity: number;

  rate: number;

  product: Product;

  invoice: Invoice;
}


export interface CreatePurchaseItemDto {

    quantity: number;
  
    rate: number;
  
    productId: number;
  
    invoiceId: number;
}