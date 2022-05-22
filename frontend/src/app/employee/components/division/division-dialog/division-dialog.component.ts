import { ToastrService } from 'ngx-toastr';
import { DivisionService } from './../../../services/division.service';
import { ErrorMatcher } from './../../../../core/error-matcher';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-division-dialog',
  templateUrl: './division-dialog.component.html',
  styleUrls: ['./division-dialog.component.scss'],
})
export class DivisionDialogComponent implements OnInit {
  divisionForm: FormGroup;
  errorMatcher = new ErrorMatcher();

  constructor(
    private bulder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private divisionService: DivisionService,
    private dialogRef: MatDialogRef<DivisionDialogComponent>,
    private toastr: ToastrService
  ) {
    this.divisionForm = this.bulder.group({
      id: 0,
      name: ['', Validators.required],
    });

    if (data.division) {
      this.divisionForm.patchValue(data.division);
    }
  }

  ngOnInit(): void {}

  save() {
    const id = this.divisionForm.value.id;
    if (id) {
      this.divisionService
        .updateDivision(id, this.divisionForm.value)
        .subscribe({
          next: () => this.dialogRef.close('edit'),
          error: (err) => this.toastr.error(err.error.message),
        });
    } else {
      this.divisionService.createDivision(this.divisionForm.value).subscribe({
        next: () => this.dialogRef.close('save'),
        error: (err) => this.toastr.error(err.error.message),
      });
    }
  }
}
