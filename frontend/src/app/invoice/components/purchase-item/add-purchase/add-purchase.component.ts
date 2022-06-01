import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { User } from './../../../../auth/models/user.model';
import { AuthService } from './../../../../auth/services/auth.service';
import { EmployeeService } from './../../../../employee/services/employee.service';
import { InvoiceRequestPayload } from './../../../models/invoice.model';
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
  id = 0;

  constructor(
    private invoiceService: InvoiceService,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private supplierService: SupplierService,
    private authService: AuthService,
    private productService: ProductService,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute
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
    // For Edit
    this.activatedRoute.params.subscribe((resp) => {
      const id = resp['id'];
      if (id != 0) {
        this.invoiceService.findInvoiceById(id).subscribe((resp) => {
          this.id = id;

          const modified_purchaseItems = resp.purchaseItems.map((pi) => ({
            ...pi,
            productId: pi.product.name,
          }));

          // Add required PurchaseItems for FormArray
          modified_purchaseItems.forEach((_, index) => {
            if (index !== modified_purchaseItems.length - 1)
              this.addPurchaseItem();
          });

          this.invoiceForm.patchValue({
            ...resp,
            supplierId: resp.supplier.id,
            purchaseItems: modified_purchaseItems,
          });

          this.quantity_rate_onChanges();
        });
      }
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

              if (this.id) {
                this.invoiceService
                  .updateInvoice(this.id, this.invoiceRequestPayload)
                  .subscribe({
                    next: (_) => {
                      this.router.navigateByUrl(
                        '/private/invoice/purchase-item'
                      );
                    },
                    error: (err) => {
                      this.toastr.error(err.error.message);
                    },
                  });
              } else {
                this.invoiceService
                  .createInvoice(this.invoiceRequestPayload)
                  .subscribe({
                    next: (_) => {
                      this.router.navigateByUrl(
                        '/private/invoice/purchase-item'
                      );
                    },
                    error: (err) => {
                      this.toastr.error(err.error.message);
                    },
                  });
              }
            });
        });
    });
  }

  productNameOnChanges(inputValue: string) {
    this.purchaseItems.controls.forEach((_, index) => {
      const productNameControl = this.purchaseItems.at(index).get('productId');

      // Autocomplete
      this.productsFilterOptions = productNameControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterProductByName(value))
      );

      // Check Duplication
      if (index !== this.purchaseItems.controls.length - 1) {
        if (productNameControl.value == inputValue) {
          this.toastr.warning('Already added');
          if (inputValue === productNameControl.value) {
            this.removePurchaseItem(this.purchaseItems.controls.length - 1);
          }
        }
      }

      // Show In Stock Quantity
      this.products.forEach((p) => {
        if (p.name === productNameControl.value) {
          this.purchaseItems.at(index)?.get('stockQty')?.setValue(p.quantity);
        }
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
