import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from './../../models/invoice.model';
import { InvoiceService } from './../../services/invoice.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-purchase-item',
  templateUrl: './purchase-item.component.html',
  styleUrls: ['./purchase-item.component.scss'],
})
export class PurchaseItemComponent implements OnInit {
  invoices: Invoice[];
  invoicesDataSource: MatTableDataSource<Invoice>;
  displayColumns: string[] = [
    'id',
    'purchaseDate',
    'supplier',
    'employee',
    'paymentStatus',
    'details',
    'actions',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private invoiceService: InvoiceService, private router: Router) {
    this.getAllInvoices();
  }

  filter(filterValue: string) {
    this.invoicesDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.invoicesDataSource.paginator) {
      this.invoicesDataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {}

  getAllInvoices() {
    this.invoiceService.findInvoices().subscribe((resp) => {
      this.invoices = resp.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.invoicesDataSource = new MatTableDataSource(this.invoices);
      this.invoicesDataSource.paginator = this.paginator;
      this.invoicesDataSource.sort = this.sort;
    });
  }

  showInvoiceDetails(invoice: Invoice) {
    this.router.navigate(['/private/invoice/purchase-details/', invoice.id]);
  }
}
