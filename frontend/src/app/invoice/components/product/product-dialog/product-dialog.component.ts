import { ProductRequestPayload } from './../../../models/product.model';
import { Category } from './../../../models/category.model';
import { CategoryService } from './../../../services/category.service';
import { ErrorMatcher } from './../../../../core/error-matcher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../../services/product.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit {
  productForm: FormGroup;
  productRequestPayload: ProductRequestPayload;
  errorMatcher = new ErrorMatcher();
  categories: Category[] = [];

  constructor(
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private builder: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.productForm = this.builder.group({
      id: 0,
      name: ['', Validators.required],
      quantity: [0, Validators.min(0)],
      destroyed: 0,
      categoryId: ['', Validators.required],
      is_active: 'true',
    });

    if (data.product) {
      this.productForm.patchValue({
        ...data.product,
        categoryId: data.product.category.id,
        is_active: data.product.is_active + '',
      });
    }

    this.getAllCategory();
  }

  ngOnInit(): void {}

  save() {
    const id = this.productForm.value.id;

    this.productRequestPayload = {
      ...this.productForm.value,
      is_active: this.productForm.value.is_active === 'true' ? true : false,
    };

    if (id) {
      this.productService
        .updateProduct(id, this.productRequestPayload)
        .subscribe({
          next: (resp) => this.dialogRef.close('edit'),
          error: (err) => this.toastr.error(err.error.message),
        });
    } else {
      this.productService.createProduct(this.productRequestPayload).subscribe({
        next: (resp) => this.dialogRef.close('save'),
        error: (err) => this.toastr.error(err.error.message),
      });
    }
  }

  getAllCategory() {
    this.categoryService
      .findAllCategories()
      .subscribe((resp) => (this.categories = resp));
  }
}
