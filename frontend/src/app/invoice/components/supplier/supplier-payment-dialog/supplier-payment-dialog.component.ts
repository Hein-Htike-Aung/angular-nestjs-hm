import { Supplier } from './../../../models/supplier.model';
import { SupplierService } from './../../../services/supplier.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-payment-dialog',
  templateUrl: './supplier-payment-dialog.component.html',
  styleUrls: ['./supplier-payment-dialog.component.scss'],
})
export class SupplierPaymentDialogComponent implements OnInit {
  supplier: Supplier;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    supplierService: SupplierService,
    private dialogRef: MatDialogRef<SupplierPaymentDialogComponent>
  ) {
    if (data.supplier) {
      this.supplier = data.supplier;
    }
  }

  ngOnInit(): void {}
}
