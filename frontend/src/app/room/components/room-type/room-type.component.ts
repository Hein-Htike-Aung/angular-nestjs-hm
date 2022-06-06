import { RoomTypeDialogComponent } from './room-type-dialog/room-type-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { RoomTypeService } from './../../services/room-type.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RoomType } from '../../models/room-type.model';

@Component({
  selector: 'app-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss'],
})
export class RoomTypeComponent implements OnInit {
  roomTypes: RoomType[];
  displayColumns: string[] = ['id', 'roomType', 'actions'];
  roomTypesDataSource: MatTableDataSource<RoomType>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private roomTypeService: RoomTypeService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.getAllRoomTypes();
  }

  ngOnInit(): void {}

  getAllRoomTypes() {
    this.roomTypeService.findAllRoomTypes().subscribe({
      next: (resp) => {
        this.roomTypes = resp.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        this.roomTypesDataSource = new MatTableDataSource(this.roomTypes);
        this.roomTypesDataSource.paginator = this.paginator;
        this.roomTypesDataSource.sort = this.sort;
      },
    });
  }

  filter(filterValue: string) {
    this.roomTypesDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.roomTypesDataSource.paginator) {
      this.roomTypesDataSource.paginator.firstPage();
    }
  }

  openDialog(title: string, roomType?: RoomType) {
    this.dialog
      .open(RoomTypeDialogComponent, {
        data: {
          title,
          roomType,
        },
        position: {
          top: '20px',
        },
        width: '500px',
      })
      .afterClosed()
      .subscribe(() => this.getAllRoomTypes());
  }

  delete(roomType: RoomType) {
    this.snackBar
      .open(`delete ${roomType.roomType}`, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
      .onAction()
      .subscribe(() => {
        this.roomTypeService.deleteRoomType(roomType.id).subscribe({
          next: () => this.getAllRoomTypes(),
          error: (err) => this.toastr.error(err.error.message),
        });
      });
  }
}
