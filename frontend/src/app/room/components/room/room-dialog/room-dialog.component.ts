import { RoomTypeService } from './../../../services/room-type.service';
import { RoomType } from './../../../models/room-type.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { timeStamp } from 'console';
import { ToastrService } from 'ngx-toastr';
import { ErrorMatcher } from '../../../../core/error-matcher';
import { Room } from '../../../models/room.model';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.scss'],
})
export class RoomDialogComponent implements OnInit {
  room: Room;
  roomForm: FormGroup;
  roomTypes: RoomType[];

  errorMatcher = new ErrorMatcher();

  constructor(
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<RoomDialogComponent>,
    private builder: FormBuilder,
    private roomTypeService: RoomTypeService
  ) {
    this.roomForm = this.builder.group({
      id: 0,
      room_number: ['', Validators.required],
      roomTypeId: ['', [Validators.required, Validators.required]],
      size: ['', [Validators.min(0), Validators.required]],
      bed_numbers: ['', [Validators.min(0), Validators.required]],
      room_status: ['AVAILABLE', Validators.required],
      price: ['', [Validators.min(0), Validators.required]],
      description: '',
    });

    if (data.room) {
      this.roomForm.patchValue({
        ...data.room,
        roomTypeId: data.room.room_type.id,
      });
    }

    this.getAllRoomTypes();
  }

  ngOnInit(): void {}

  getAllRoomTypes() {
    this.roomTypeService
      .findAllRoomTypes()
      .subscribe((resp) => (this.roomTypes = resp));
  }

  save() {
    const id = this.roomForm.value.id;

    if (id) {
      this.roomService.updateRoom(id, this.roomForm.value).subscribe({
        next: () => this.dialogRef.close('edit'),
        error: (err) => this.toastr.error(err.error.message),
      });
    } else {
      this.roomService.createRoomType(this.roomForm.value).subscribe({
        next: () => this.dialogRef.close('save'),
        error: (err) => this.toastr.error(err.error.message),
      });
    }
  }
}
