import { Product } from './../../../models/product.model';
import { ErrorMatcher } from './../../../../core/error-matcher';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../../services/product.service';
import { Category } from './../../../models/category.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from './../../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { CloseScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-product-destroyed-dialog',
  templateUrl: './product-destroyed-dialog.component.html',
  styleUrls: ['./product-destroyed-dialog.component.scss'],
})
export class ProductDestroyedDialogComponent implements OnInit {
  destroyProductForm: FormGroup;
  categories: Category[] = [];
  products: Product[] = [];
  product: Product;
  errorMatcher: ErrorMatcher = new ErrorMatcher();

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ProductDestroyedDialogComponent>
  ) {
    this.destroyProductForm = this.builder.group({
      productId: ['', Validators.required],
      destroyedQuantity: ['', Validators.required],
    });

    this.getAllCategories();
  }

  ngOnInit(): void {}

  save() {
    this.productService
      .destroyProduct(
        this.destroyProductForm.value.productId,
        this.destroyProductForm.value.destroyedQuantity
      )
      .subscribe({
        next: () => this.dialogRef.close(),
        error: (err) => this.toastr.error(err.error.message),
      });
  }

  categoryOnChanges(categoryId: any) {
    if (categoryId) {
      this.productService
        .findProductsByCategoryId(categoryId)
        .subscribe((resp) => (this.products = resp));
    }
  }

  productOnChanges(productId: any) {
    if (productId) {
      this.productService
        .findById(productId)
        .subscribe((resp) => (this.product = resp));
    }
  }

  getAllCategories() {
    this.categoryService
      .findAllCategories()
      .subscribe((resp) => (this.categories = resp));
  }
}
