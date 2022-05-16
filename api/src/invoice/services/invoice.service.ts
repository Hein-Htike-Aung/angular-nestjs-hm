import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  catchError,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Repository } from 'typeorm';
import { Supplier } from '../models/entities/supplier.entity';
import { Employee } from './../../employee/models/entities/employee.entity';
import { EmployeeService } from './../../employee/services/employee.service';
import { ErrorHandler } from './../../shared/utils/error.handler';
import { CreateInvoiceDto } from './../models/dto/createInvoice.dto';
import { CreatePurchaseItemDto } from './../models/dto/createPurchaseItem.dto';
import { UpdateInvoiceDto } from './../models/dto/updateInvoice.dto';
import { Invoice } from './../models/entities/invoice.entity';
import { Product } from './../models/entities/Product.entity';
import { PurchaseItem } from './../models/entities/purchase-item.entity';
import { ProductService } from './product.service';
import { SupplierService } from './supplier.service';
var _ = require('underscore');

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    @InjectRepository(PurchaseItem)
    private purchaseItemRepo: Repository<PurchaseItem>,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    @Inject(forwardRef(() => SupplierService))
    private supplierService: SupplierService,
  ) {}

  saveInvoice(
    createInvoiceDto: CreateInvoiceDto | UpdateInvoiceDto,
    id?: number,
  ): Observable<Invoice> {
    const { createPurchaseItemDto, ...invoice } = createInvoiceDto;
    
    // map CreatePurchaseItemDto[] -> PurchaseItem[]
    return of(createPurchaseItemDto).pipe(
      mergeMap((resp: CreatePurchaseItemDto[]) => {
        return forkJoin(
          resp.map((item) =>
            this.productService.findProductById(item.productId).pipe(
              switchMap((product) => {
                item['product'] = product;
                return of(this.purchaseItemRepo.create(item));
              }),
            ),
          ),
        );
      }),
      switchMap((purchaseItems: PurchaseItem[]) => {
        if (id) {
          return this.findInvoiceById(id).pipe(
            switchMap((storedInvoice: Invoice) => {
              return this.createInvoice(invoice).pipe(
                switchMap((invoice: Invoice) => {
                  return from(this.invoiceRepo.delete(id)).pipe(
                    switchMap((_) => {
                      return from(
                        // Save Invoice & Purchase Items using cascade
                        this.invoiceRepo.save({ purchaseItems, ...invoice }),
                      ).pipe(
                        tap((_) => {
                          // Update Products Quantity
                          this.updateProductsQuantityForUpdateInvoice(
                            storedInvoice,
                            purchaseItems,
                          );
                        }),
                      );
                    }),
                  );
                }),
              );
            }),
          );
        } else {
          return this.createInvoice(invoice).pipe(
            switchMap((invoice: Invoice) => {
              // Save Invoice & Purchase Items using cascade
              return from(
                this.invoiceRepo.save({ purchaseItems, ...invoice }),
              ).pipe(
                tap((_) => {
                  // Update Products Quantity
                  this.updateProductsQuantity(purchaseItems);
                }),
              );
            }),
          );
        }
      }),
    );
  }

  updateProductsQuantity(purchaseItems: PurchaseItem[]) {
    purchaseItems.forEach((item) => {
      this.productService
        .findProductById(item.product.id)
        .pipe(
          tap((product: Product) => {
            this.productService
              .updateProduct(item.product.id, {
                quantity: product.quantity + item.quantity,
              })
              .subscribe();
          }),
        )
        .subscribe();
    });
  }

  updateProductsQuantityForUpdateInvoice(
    storedInvoice: Invoice,
    purchaseItems: PurchaseItem[],
  ) {
    const oldItems = storedInvoice.purchaseItems;
    const newItems = purchaseItems;

    const oldItemsProductsIds = oldItems.map((ot) => ot.product.id);
    const newItemsProductsIds = newItems.map((nt) => nt.product.id);

    const targetAddingIds: number[] = _.difference(
      newItemsProductsIds,
      oldItemsProductsIds,
    );

    newItems.forEach((nt) => {
      if (targetAddingIds.includes(nt.product.id)) {
        // add New
        this.addProductQuantity(nt, nt.quantity, true);
      }
    });

    const targetRemovingIds: number[] = _.difference(
      oldItemsProductsIds,
      newItemsProductsIds,
    );

    oldItems.forEach((ot) => {
      if (targetRemovingIds.includes(ot.product.id)) {
        // removing
        this.deductProductQuantity(ot, ot.quantity);
      }
    });

    oldItems.forEach((storedItem: PurchaseItem) => {
      newItems.forEach((newItem) => {
        if (
          storedItem.product.id === newItem.product.id &&
          storedItem.quantity !== newItem.quantity
        ) {
          // add or reduce
          this.addProductQuantity(storedItem, newItem.quantity);
        }
      });
    });
  }

  addProductQuantity(
    storedItem: PurchaseItem,
    updatedQuantity: number,
    addNew = false,
  ) {
    this.productService
      .findProductById(storedItem.product.id)
      .pipe(
        tap((product: Product) => {
          let originalQuantity =
            product.quantity - (addNew ? 0 : storedItem.quantity);
          this.productService
            .updateProduct(storedItem.product.id, {
              quantity: originalQuantity + updatedQuantity,
            })
            .subscribe();
        }),
      )
      .subscribe();
  }

  deductProductQuantity(storedItem: PurchaseItem, updatedQuantity: number) {
    this.productService
      .findProductById(storedItem.product.id)
      .pipe(
        tap((product: Product) => {
          this.productService
            .updateProduct(storedItem.product.id, {
              quantity: product.quantity - updatedQuantity,
            })
            .subscribe();
        }),
      )
      .subscribe();
  }

  createInvoice(
    invoice: CreateInvoiceDto | UpdateInvoiceDto,
  ): Observable<Invoice> {
    return this.supplierService.findSupplierById(invoice.supplierId).pipe(
      switchMap((supplier: Supplier) => {
        return this.employeeService.findEmployeeById(invoice.employeeId).pipe(
          map((employee: Employee) => {
            return this.invoiceRepo.create({
              supplier,
              employee,
              ...invoice,
            });
          }),
        );
      }),
    );
  }

  findInvoiceById(invoiceId: number): Observable<Invoice> {
    return from(
      this.invoiceRepo.findOneOrFail({
        where: { id: invoiceId },
        relations: [
          'employee',
          'supplier',
          'purchaseItems',
          'purchaseItems.product',
        ],
      }),
    ).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(invoiceId, 'Invoice')),
    );
  }

  findPurchaseItemsByProductId(productId: number): Observable<PurchaseItem[]> {
    return from(
      this.purchaseItemRepo.find({ where: { product: { id: productId } } }),
    );
  }

  findAllInvoices(): Observable<Invoice[]> {
    return from(
      this.invoiceRepo.find({
        relations: [
          'employee',
          'supplier',
          'purchaseItems',
          'purchaseItems.product',
        ],
      }),
    );
  }
}
