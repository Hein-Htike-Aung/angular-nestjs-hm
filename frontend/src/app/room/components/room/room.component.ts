import { RoomDialogComponent } from './room-dialog/room-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RoomService } from './../../services/room.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Room } from './../../models/room.model';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  rooms: Room[];
  displayColumns: string[] = [
    'id',
    'room_number',
    'room_type',
    'size',
    'bed_numbers',
    'room_status',
    'price',
    'description',
    'actions',
  ];
  roomsDataSource: MatTableDataSource<Room>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private roomService: RoomService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.getAllRooms();
  }

  ngOnInit(): void {}

  getAllRooms() {
    this.roomService.findAllRooms().subscribe({
      next: (resp) => {
        this.rooms = resp.sort((a, b) =>
          b?.room_status.localeCompare(a?.room_status)
        );

        this.roomsDataSource = new MatTableDataSource(this.rooms);
        this.roomsDataSource.paginator = this.paginator;
        this.roomsDataSource.sort = this.sort;
      },
    });
  }

  filter(filterValue: string) {
    this.roomsDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.roomsDataSource.paginator) {
      this.roomsDataSource.paginator.firstPage();
    }
  }

  openDialog(title: string, room?: Room) {
    this.dialog
      .open(RoomDialogComponent, {
        data: {
          title,
          room,
        },
        position: {
          top: '20px',
        },
        width: '500px',
      })
      .afterClosed()
      .subscribe(() => this.getAllRooms());
  }

  delete(room: Room) {
    this.snackBar
      .open(`delete ${room.room_number}`, 'OK', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
      .onAction()
      .subscribe(() => {
        this.roomService.deleteRoom(room.id).subscribe({
          next: () => this.getAllRooms(),
          error: (err) => this.toastr.error(err.error.message),
        });
      });
  }
}
