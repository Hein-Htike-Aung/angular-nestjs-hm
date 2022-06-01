import { SupplierPaymentDialogComponent } from './supplier-payment-dialog/supplier-payment-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierDialogComponent } from './supplier-dialog/supplier-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Supplier } from './../../models/supplier.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { SupplierService } from './../../services/supplier.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
})
export class SupplierComponent implements OnInit {
  suppliers: Supplier[];
  suppliersDataSource: MatTableDataSource<Supplier>;
  displayColumns: string[] = [
    'id',
    'name',
    'phone',
    'email',
    'address',
    'totalAmount',
    'dueAmount',
    'paidAmount',
    'actions',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private supplierService: SupplierService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {
    this.getAllSuppliers();
  }

  ngOnInit(): void {}

  filter(filterValue: string) {
    this.suppliersDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.suppliersDataSource.paginator) {
      this.suppliersDataSource.paginator.firstPage();
    }
  }

  openDialog(title: string, supplier?: Supplier) {
    this.dialog
      .open(SupplierDialogComponent, {
        data: {
          title,
          supplier,
        },
        position: {
          top: '20px',
        },
        width: '500px',
      })
      .afterClosed()
      .subscribe(() => this.getAllSuppliers());
  }

  openPaymentDialog(supplier: Supplier) {
    this.dialog
      .open(SupplierPaymentDialogComponent, {
        data: {
          supplier,
        },
        position: {
          top: '20px',
        },
        width: '500px',
      })
      .afterClosed()
      .subscribe(() => this.getAllSuppliers());
  }

  delete(supplier: Supplier) {
    this.snackBar
      .open(`Delete ${supplier.name}`, 'OK', {})
      .onAction()
      .subscribe(() => {
        this.supplierService.deleteSupplier(supplier.id).subscribe({
          next: () => this.getAllSuppliers(),
          error: (err) => this.toastr.error(err.error.message),
        });
      });
  }

  getAllSuppliers() {
    this.supplierService.findAllSupplier().subscribe({
      next: (resp) => {
        this.suppliers = resp.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        this.suppliersDataSource = new MatTableDataSource(this.suppliers);
        this.suppliersDataSource.sort = this.sort;
        this.suppliersDataSource.paginator = this.paginator;
      },
      error: (err) => this.toastr.error(err.error.message),
    });
  }
}
