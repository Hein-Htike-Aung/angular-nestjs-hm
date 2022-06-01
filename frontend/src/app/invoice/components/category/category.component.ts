import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from './../../models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categories: Category[];
  displayColumns: string[] = ['id', 'name', 'actions'];
  categoryDataSource: MatTableDataSource<Category>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.getAllCategories();
  }

  ngOnInit(): void {}

  filter(filterValue: string) {
    this.categoryDataSource.filter = filterValue.trim().toLocaleLowerCase();
    if (this.categoryDataSource.paginator) {
      this.categoryDataSource.paginator.firstPage();
    }
  }

  getAllCategories() {
    this.categoryService.findAllCategories().subscribe({
      next: (resp) => {
        this.categories = resp.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.categoryDataSource = new MatTableDataSource(this.categories);
        this.categoryDataSource.paginator = this.paginator;
        this.categoryDataSource.sort = this.sort;
      },
    });
  }

  openDialog(title: string, category?: Category) {
    this.dialog
      .open(CategoryDialogComponent, {
        data: {
          title,
          category,
        },
        position: {
          top: '20px',
        },
        width: '500px'
      })
      .afterClosed()
      .subscribe(() => this.getAllCategories());
  }

  delete(category: Category) {
    this.snackBar
      .open(`delete ${category.name}`, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
      .onAction()
      .subscribe(() => {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => this.getAllCategories(),
          error: (err) => this.toastr.error(err.error.message),
        });
      });
  }
}
