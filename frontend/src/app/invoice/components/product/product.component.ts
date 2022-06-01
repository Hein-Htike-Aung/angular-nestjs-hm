import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from './../../models/product.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  productsDataSource: MatTableDataSource<Product>;
  displayColumns: string[] = [
    'id',
    'name',
    'category',
    'quantity',
    'destroyed',
    'is_active',
    'actions',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.getAllProducts();
  }

  ngOnInit(): void {}

  filter(filterValue: string) {
    this.productsDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.productsDataSource.paginator) {
      this.productsDataSource.paginator.firstPage();
    }
  }

  getAllProducts() {
    this.productService.findAllProducts().subscribe((resp) => {
      this.products = resp.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.productsDataSource = new MatTableDataSource(this.products);
      this.productsDataSource.sort = this.sort;
      this.productsDataSource.paginator = this.paginator;
    });
  }

  openDialog(title: string, product?: Product) {
    this.dialog
      .open(ProductDialogComponent, {
        data: {
          title,
          product,
        },
        position: {
          top: '20px',
        },
        width: '500px',
      })
      .afterClosed()
      .subscribe(() => this.getAllProducts());
  }

  delete(product: Product) {
    this.snackBar
      .open(`Delete product ${product.name}`, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
      .onAction()
      .subscribe(() => {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => this.getAllProducts(),
          error: (err) => this.toastr.error(err.error.message),
        });
      });
  }
}
