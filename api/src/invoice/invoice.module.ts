import { EmployeeModule } from './../employee/employee.module';
import { Supplier } from './models/entities/supplier.entity';
import { PurchaseItem } from './models/entities/purchase-item.entity';
import { Product } from './models/entities/Product.entity';
import { Invoice } from './models/entities/invoice.entity';
import { Category } from './models/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { ProductController } from './controllers/product.controller';
import { SupplierController } from './controllers/supplier.controller';
import { CategoryService } from './services/category.service';
import { InvoiceService } from './services/invoice.service';
import { ProductService } from './services/product.service';
import { SupplierService } from './services/supplier.service';
import { Employee } from '../employee/models/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Invoice,
      Product,
      PurchaseItem,
      Supplier,
      Employee
    ]),
    forwardRef(() => EmployeeModule)
  ],
  controllers: [
    CategoryController,
    InvoiceController,
    ProductController,
    SupplierController,
  ],
  providers: [CategoryService, InvoiceService, ProductService, SupplierService],
})
export class InvoiceModule {}
