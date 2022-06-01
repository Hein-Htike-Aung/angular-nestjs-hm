import { PurchaseItem } from './../../../models/purchase-item.model';
import { Invoice } from './../../../models/invoice.model';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from './../../../services/invoice.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss']
})
export class PurchaseDetailsComponent implements OnInit {

  invoice: Invoice;
  purchaseItemsDataSource: MatTableDataSource<PurchaseItem>;
  displayColumns: string[] = ['product', 'quantity', 'rate', 'totalPrice'];


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute
  ) { 
    this.activatedRoute.params.subscribe(resp => {
      const id = resp['id'];
      if(id) {
        this.invoiceService.findInvoiceById(id).subscribe(resp => {
          this.invoice = resp;
          this.purchaseItemsDataSource = new MatTableDataSource(this.invoice.purchaseItems);
          this.purchaseItemsDataSource.paginator = this.paginator;
          this.purchaseItemsDataSource.sort = this.sort;
        });
      }
    })
  }

  ngOnInit(): void {

  }

  print() {

  }

}
