export interface Supplier {
  id: number;

  name: string;

  phone: string;

  email: string;

  address: string;

  totalAmount: number;

  dueAmount: number;

  paidAmount: number;

  createdAt: Date;

  updatedAt: Date;
}
