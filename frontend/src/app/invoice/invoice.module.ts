import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './../app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { ProductComponent } from './components/product/product.component';
import { CategoryComponent } from './components/category/category.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { ProductDestroyedComponent } from './components/product-destroyed/product-destroyed.component';
import { CategoryDialogComponent } from './components/category/category-dialog/category-dialog.component';
import { SupplierDialogComponent } from './components/supplier/supplier-dialog/supplier-dialog.component';
import { SupplierPaymentDialogComponent } from './components/supplier/supplier-payment-dialog/supplier-payment-dialog.component';
import { ProductDialogComponent } from './components/product/product-dialog/product-dialog.component';
import { ProductDestroyedDialogComponent } from './components/product-destroyed/product-destroyed-dialog/product-destroyed-dialog.component';
import { PurchaseItemComponent } from './components/purchase-item/purchase-item.component';
import { AddPurchaseComponent } from './components/purchase-item/add-purchase/add-purchase.component';
import { PurchaseDetailsComponent } from './components/purchase-item/purchase-details/purchase-details.component';

@NgModule({
  declarations: [
    ProductComponent,
    CategoryComponent,
    SupplierComponent,
    ProductDestroyedComponent,
    CategoryDialogComponent,
    SupplierDialogComponent,
    SupplierPaymentDialogComponent,
    ProductDialogComponent,
    ProductDestroyedDialogComponent,
    PurchaseItemComponent,
    AddPurchaseComponent,
    PurchaseDetailsComponent,
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    HttpClientModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CurrencyPipe
  ]
})
export class InvoiceModule {}
