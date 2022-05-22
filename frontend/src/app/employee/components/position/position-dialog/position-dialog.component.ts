import { ErrorMatcher } from './../../../../core/error-matcher';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Position } from './../../../models/position.model';
import { PositionService } from './../../../services/position.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-position-dialog',
  templateUrl: './position-dialog.component.html',
  styleUrls: ['./position-dialog.component.scss'],
})
export class PositionDialogComponent implements OnInit {
  positionForm: FormGroup;
  positions: Position[] = [];
  errorMatcher = new ErrorMatcher();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PositionDialogComponent>,
    private positionService: PositionService,
    private builder: FormBuilder,
    private toastr: ToastrService
  ) {

    this.positionForm = this.builder.group({
      id: 0,
      name: ['', Validators.required],
      details: '',
    });

    if (data.position) {
      this.positionForm.patchValue(data.position);
    }
  }

  ngOnInit(): void {}

  save() {
    const id = this.positionForm.value.id;
    if (id) {
      this.positionService
        .updatePosition(id, this.positionForm.value)
        .subscribe({
          next: () => {
            this.dialogRef.close('edit');
          },
          error: (err) => this.toastr.error(err.error.message),
        });
    } else {
      this.positionService.createPosition(this.positionForm.value).subscribe({
        next: () => {
          this.dialogRef.close('save');
        },
        error: (err) => this.toastr.error(err.error.message),
      });
    }
  }
}
