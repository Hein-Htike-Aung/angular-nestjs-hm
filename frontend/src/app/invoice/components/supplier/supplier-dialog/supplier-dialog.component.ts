import { ErrorMatcher } from './../../../../core/error-matcher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier } from './../../../models/supplier.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from './../../../services/supplier.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-supplier-dialog',
  templateUrl: './supplier-dialog.component.html',
  styleUrls: ['./supplier-dialog.component.scss'],
})
export class SupplierDialogComponent implements OnInit {
  supplier: Supplier;
  supplierForm: FormGroup;

  errorMatcher: ErrorMatcher;

  constructor(
    private supplierService: SupplierService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SupplierDialogComponent>,
    private builder: FormBuilder
  ) {
    this.supplierForm = this.builder.group({
      id: 0,
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
    });

    if (data.supplier) {
      this.supplierForm.patchValue(data.supplier);
    }
  }

  ngOnInit(): void {}

  save() {
    const id = this.supplierForm.value.id;
    if (id) {
      this.supplierService
        .updateSupplier(id, this.supplierForm.value)
        .subscribe({
          next: () => this.dialogRef.close('edit'),
          error: (err) => this.toastr.error(err.error.message),
        });
    } else {
      this.supplierService.createSupplier(this.supplierForm.value).subscribe({
        next: () => this.dialogRef.close('save'),
        error: (err) => this.toastr.error(err.error.message),
      });
    }
  }
}
