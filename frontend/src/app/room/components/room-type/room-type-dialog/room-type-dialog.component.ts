import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomTypeService } from './../../../services/room-type.service';
import { ErrorMatcher } from './../../../../core/error-matcher';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoomType } from './../../../models/room-type.model';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-room-type-dialog',
  templateUrl: './room-type-dialog.component.html',
  styleUrls: ['./room-type-dialog.component.scss'],
})
export class RoomTypeDialogComponent implements OnInit {
  roomType: RoomType;
  roomTypeForm: FormGroup;

  errorMatcher = new ErrorMatcher();

  constructor(
    private roomTypeService: RoomTypeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<RoomTypeDialogComponent>,
    private builder: FormBuilder
  ) {
    this.roomTypeForm = this.builder.group({
      id: 0,
      roomType: ['', Validators.required],
    });

    if (data.roomType) {
      this.roomTypeForm.patchValue(data.roomType);
    }
  }

  ngOnInit(): void {}

  save() {
    const id = this.roomTypeForm.value.id;

    if (id) {
      this.roomTypeService
        .updateRoomType(id, this.roomTypeForm.value)
        .subscribe({
          next: () => this.dialogRef.close('edit'),
          error: (err) => this.toastr.error(err.error.message),
        });
    } else {
      this.roomTypeService.createRoomType(this.roomTypeForm.value).subscribe({
        next: () => this.dialogRef.close('save'),
        error: (err) => this.toastr.error(err.error.message),
      });
    }
  }
}
