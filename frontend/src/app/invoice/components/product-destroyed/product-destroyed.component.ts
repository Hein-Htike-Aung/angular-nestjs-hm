import { ProductDestroyedDialogComponent } from './product-destroyed-dialog/product-destroyed-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from './../../models/product.model';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-product-destroyed',
  templateUrl: './product-destroyed.component.html',
  styleUrls: ['./product-destroyed.component.scss'],
})
export class ProductDestroyedComponent implements OnInit {
  products: Product[] = [];
  displayColumns: string[] = [
    'id',
    'name',
    'category',
    'quantity',
    'destroyed',
    'is_active',
  ];
  productsDataSource: MatTableDataSource<Product>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {
    this.getAllDestroyedProducts();
  }

  ngOnInit(): void {}

  filter(filterValue: string) {
    this.productsDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.productsDataSource.paginator) {
      this.productsDataSource.paginator.firstPage();
    }
  }

  getAllDestroyedProducts() {
    this.productService.findAllProducts().subscribe((resp) => {
      this.products = resp.filter((p) => p.destroyed > 0);
      this.productsDataSource = new MatTableDataSource(this.products);
      this.productsDataSource.paginator = this.paginator;
      this.productsDataSource.sort = this.sort;
    });
  }

  openDialog() {
    this.dialog
      .open(ProductDestroyedDialogComponent, {    
        position: {
          top: '20px',
        },
        width: '500px',
      })
      .afterClosed()
      .subscribe((resp) => {
        this.getAllDestroyedProducts();
      });
  }
}
