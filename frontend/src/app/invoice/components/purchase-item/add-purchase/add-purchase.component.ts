import { EmployeeService } from './../../../../employee/services/employee.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, startWith, tap } from 'rxjs';
import { User } from './../../../../auth/models/user.model';
import { AuthService } from './../../../../auth/services/auth.service';
import {
  InvoiceRequestPayload,
  PaymentStatus,
} from './../../../models/invoice.model';
import { Product } from './../../../models/product.model';
import { Supplier } from './../../../models/supplier.model';
import { InvoiceService } from './../../../services/invoice.service';
import { ProductService } from './../../../services/product.service';
import { SupplierService } from './../../../services/supplier.service';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.scss'],
})
export class AddPurchaseComponent implements OnInit {
  invoiceRequestPayload: InvoiceRequestPayload;
  invoiceForm: FormGroup;
  suppliers: Supplier[] = [];
  loggedInUser$ = new BehaviorSubject<User>(null);
  products: Product[] = [];
  productsFilterOptions: Observable<Product[]>;
  totalAmount = 0;

  constructor(
    private invoiceService: InvoiceService,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private supplierService: SupplierService,
    private authService: AuthService,
    private productService: ProductService,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.authService.loggedInUser.subscribe((user: User) =>
      this.loggedInUser$.next(user)
    );

    this.invoiceForm = this.builder.group({
      supplierId: ['', Validators.required],
      purchaseDate: [new Date(), Validators.required],
      employeeId: 0,
      paymentStatus: ['', Validators.required],
      details: '',
      purchaseItems: this.builder.array([]),
    });

    this.getAllSupplier();
    this.getAllProducts();
    this.addPurchaseItem();
  }

  ngOnInit(): void {
    this.purchaseItems.controls.forEach((_, index) => {
      /* Product Input On Changes */
      this.productsFilterOptions = this.purchaseItems
        .at(index)
        .get('productId')
        .valueChanges.pipe(
          tap((value) => {
            this.products.forEach((p) => {
              if (p.name === value) {
                this.purchaseItems
                  .at(index)
                  .get('stockQty')
                  .setValue(p.quantity);
              }
            });
          }),
          startWith(''),
          map((value) => this._filterProductByName(value))
        );
    });
  }

  save() {
    this.loggedInUser$.subscribe((employee) => {
      this.authService
        .findUserWithUsername(employee.username)
        .subscribe((user: User) => {
          this.invoiceRequestPayload = { ...this.invoiceForm.value };

          this.employeeService
            .findEmployeeByUserId(user.id)
            .subscribe((employee) => {
              // Set employee By id
              this.invoiceRequestPayload.employeeId = employee.id;

              // change product name wiht product id
              this.invoiceRequestPayload.purchaseItems.forEach((pi) => {
                this.products.forEach((p) => {
                  if (p.name === pi.productId + '') {
                    pi.productId = p.id;
                  }
                });
              });

              this.invoiceService
                .createInvoice(this.invoiceRequestPayload)
                .subscribe({
                  next: (_) => {
                    this.router.navigateByUrl('/private/invoice/purchase-item');
                  },
                  error: (err) => {
                    console.log(err);
                    this.toastr.error(err.error.message);
                  },
                });
            });
        });
    });
  }

  quantity_rate_onChanges() {
    this.purchaseItems.controls.forEach((_, index) => {
      const rate = this.purchaseItems.at(index).get('rate').value;
      const quantity = this.purchaseItems.at(index).get('quantity').value;

      if (rate && quantity) {
        this.purchaseItems
          .at(index)
          .get('total')
          .setValue(this.currencyPipe.transform(rate * quantity));
        this.calculateTotalAmount();
      }
    });
  }

  removePurchaseItem(index: number) {
    this.purchaseItems.length > 1 && this.purchaseItems.removeAt(index);
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    this.totalAmount = 0;
    this.totalAmount = this.purchaseItems.controls.reduce(
      (sum, item) =>
        (sum += Math.abs(
          item.get('total').value.substring(1).replace(/,/g, '')
        )),
      0
    );
  }

  _filterProductByName(value: string): Product[] {
    return this.products.filter((p) =>
      p.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
  }

  get purchaseItems(): FormArray {
    return this.invoiceForm.get('purchaseItems') as FormArray;
  }

  getPurchaseItem(index: number): FormControl {
    return this.purchaseItems.at(index) as FormControl;
  }

  addPurchaseItem() {
    this.purchaseItems.push(
      this.builder.group({
        productId: ['', Validators.required],
        stockQty: '',
        rate: ['', [Validators.required, Validators.min(0)]],
        quantity: ['', [Validators.required, Validators.min(0)]],
        total: '',
      })
    );
    this.calculateTotalAmount();
  }

  getAllSupplier() {
    this.supplierService
      .findAllSupplier()
      .subscribe((resp) => (this.suppliers = resp));
  }

  getAllProducts() {
    this.productService
      .findAllProducts()
      .subscribe((resp) => (this.products = resp));
  }

  supplierValueOnChanges(keyword: string) {
    this.suppliers = this.suppliers.filter((s) =>
      s.name.toLocaleLowerCase().startsWith(keyword.toLocaleLowerCase())
    );

    if (!keyword) {
      this.getAllSupplier();
    }
  }
}
