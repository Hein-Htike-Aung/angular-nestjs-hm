import { PositionDialogComponent } from './position-dialog/position-dialog.component';
import { Position } from './../../models/position.model';
import { PositionService } from './../../services/position.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
})
export class PositionComponent implements OnInit {
  positionForm: FormGroup;
  positions: Position[] = [];

  positionDataSource: MatTableDataSource<Position>;
  displayColumns: string[] = ['id', 'name', 'details', 'action'];

  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  constructor(
    private toastr: ToastrService,
    private positionService: PositionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.getAllPositions();
  }

  ngOnInit(): void {}

  filter(filterValue: string) {
    this.positionDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.positionDataSource.paginator) {
      this.positionDataSource.paginator.firstPage();
    }
  }

  getAllPositions() {
    this.positionService.findAllPosition().subscribe({
      next: (resp) => {
        this.positions = resp.sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
        this.positionDataSource = new MatTableDataSource(this.positions);

        this.positionDataSource.sort = this.matSort;
        this.positionDataSource.paginator = this.matPaginator;
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  optionDialog(title: string, position?: Position) {
    this.dialog
      .open(PositionDialogComponent, {
        data: {
          title,
          position,
        },
        position: {
          top: '20px',
        },
      })
      .afterClosed()
      .subscribe(() => this.getAllPositions());
  }

  delete(position: Position) {
    this.snackBar
      .open(`Delete ${position.name}`, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
      .onAction()
      .subscribe(() => {
        this.positionService.deletePosition(position.id).subscribe({
          next: () => this.getAllPositions(),
          error: (err) => this.toastr.error(err.error.message),
        });
      });
  }
}
