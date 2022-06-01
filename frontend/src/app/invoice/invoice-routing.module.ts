import { PurchaseItemComponent } from './components/purchase-item/purchase-item.component';
import { PurchaseItem } from './models/purchase-item.model';
import { AddPurchaseComponent } from './components/purchase-item/add-purchase/add-purchase.component';
import { ProductDestroyedComponent } from './components/product-destroyed/product-destroyed.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductComponent } from './components/product/product.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'product', component: ProductComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'destroyed-product', component: ProductDestroyedComponent },
  { path: 'purchase-item', component: PurchaseItemComponent },
  { path: 'add-purchase/:id', component: AddPurchaseComponent },
  { path: '', redirectTo: 'product', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
