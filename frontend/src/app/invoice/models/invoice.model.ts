import { Employee } from '../../employee/models/employee.model';
import { CreatePurchaseItemDto, PurchaseItem } from './purchase-item.model';
import { Supplier } from './supplier.model';

export enum PaymentStatus {
  Paid = 'Paid',
  Unpaid = 'Unpaid',
}

export interface Invoice {
  id: number;

  purchaseDate: Date;

  supplier: Supplier;

  employee: Employee;

  paymentStatus: PaymentStatus;

  details: string;

  purchaseItems: PurchaseItem[];

  createdAt: Date;

  updatedAt: Date;
}

export interface InvoiceRequestPayload {
  purchaseDate: Date;

  supplierId: number;

  employeeId: number;

  paymentStatus: PaymentStatus;

  details: string;

  purchaseItems?: CreatePurchaseItemDto[];
}
