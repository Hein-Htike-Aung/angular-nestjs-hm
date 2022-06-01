import { ErrorMatcher } from './../../../../core/error-matcher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from './../../../models/category.model';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from './../../../services/category.service';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
})
export class CategoryDialogComponent implements OnInit {
  category: Category;
  categoryForm: FormGroup;

  errorMatcher = new ErrorMatcher();

  constructor(
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    private builder: FormBuilder
  ) {
    this.categoryForm = this.builder.group({
      id: 0,
      name: ['', Validators.required],
    });

    if (data.category) {
      this.categoryForm.patchValue(data.category);
    }
  }

  ngOnInit(): void {}

  save() {
    const id = this.categoryForm.value.id;

    if (id) {
      this.categoryService
        .updateCategory(id, this.categoryForm.value)
        .subscribe({
          next: () => this.dialogRef.close('edit'),
          error: (err) => this.toastr.error(err.error.message),
        });
    } else {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => this.dialogRef.close('save'),
        error: (err) => this.toastr.error(err.error.message),
      });
    }
  }
}
