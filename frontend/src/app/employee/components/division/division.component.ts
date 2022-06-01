import { MatSnackBar } from '@angular/material/snack-bar';
import { DivisionDialogComponent } from './division-dialog/division-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Division } from './../../models/division.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DivisionService } from '../../services/division.service';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss'],
})
export class DivisionComponent implements OnInit {
  divisions: Division[] = [];
  divisionsDataSource: MatTableDataSource<Division>;
  displayColumns: string[] = ['id', 'name', 'action'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private divisionService: DivisionService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {
    this.getAllDivisions();
  }

  ngOnInit(): void {}

  getAllDivisions() {
    this.divisionService.findAllDivisions().subscribe((resp) => {
      this.divisions = resp.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.divisionsDataSource = new MatTableDataSource(this.divisions);
      this.divisionsDataSource.paginator = this.paginator;
      this.divisionsDataSource.sort = this.sort;
    });
  }

  filter(filterValue: string) {
    this.divisionsDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.divisionsDataSource.paginator) {
      this.divisionsDataSource.paginator.firstPage();
    }
  }

  openDialog(title: string, division?: Division) {
    this.dialog
      .open(DivisionDialogComponent, {
        data: {
          title,
          division,
        },
        position: {
          top: '20px',
        },
        width: '500px',
      })
      .afterClosed()
      .subscribe(() => this.getAllDivisions());
  }

  delete(division: Division) {
    this.snackBar
      .open(`Delete ${division.name}`, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
      .onAction()
      .subscribe(() => {
        this.divisionService.deleteDivision(division.id).subscribe({
          next: () => this.getAllDivisions(),
          error: (err) => this.toastr.error(err.error.message),
        });
      });
  }
}
