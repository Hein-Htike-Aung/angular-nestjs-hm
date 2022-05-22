import { SubDivisionDialogComponent } from './sub-division-dialog/sub-division-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { SubDivision } from './../../models/subDivision.model';
import { DivisionService } from './../../services/division.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sub-division',
  templateUrl: './sub-division.component.html',
  styleUrls: ['./sub-division.component.scss'],
})
export class SubDivisionComponent implements OnInit {
  subDivisions: SubDivision[] = [];
  subDivisionDataSource: MatTableDataSource<SubDivision>;
  displayColumns: string[] = ['id', 'name', 'division', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private divisionService: DivisionService,
    private snackBar: MatSnackBar
  ) {
    this.getAllSubDivision();
  }

  ngOnInit(): void {}

  filter(filterValue: string) {
    this.subDivisionDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.subDivisionDataSource.paginator) {
      this.subDivisionDataSource.paginator.firstPage();
    }
  }

  getAllSubDivision() {
    this.divisionService.findAllSubDivisions().subscribe({
      next: (resp) => {
        this.subDivisions = resp.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.subDivisionDataSource = new MatTableDataSource(this.subDivisions);
        this.subDivisionDataSource.paginator = this.paginator;
        this.subDivisionDataSource.sort = this.sort;
      },
    });
  }

  addNew() {
    this.dialog
      .open(SubDivisionDialogComponent, {
        data: {
          title: 'Add New SubDivision',
        },
        position: {
          top: '20px',
        },
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp === 'save') {
          this.getAllSubDivision();
        }
      });
  }

  edit(subDivision: SubDivision) {
    this.dialog
      .open(SubDivisionDialogComponent, {
        data: {
          title: 'Edit SubDivision',
          subDivision,
        },
        position: {
          top: '20px',
        },
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp == 'edit') {
          this.getAllSubDivision();
        }
      });
  }

  delete(subDivision: SubDivision) {
    this.snackBar
      .open(`Delete ${subDivision.name}`, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
      .onAction()
      .subscribe(() => {
        this.divisionService.deleteSubDivision(subDivision.id).subscribe({
          next: () => this.getAllSubDivision(),
          error: (err) => this.toastr.error(err.error.message),
        });
      });
  }
}
