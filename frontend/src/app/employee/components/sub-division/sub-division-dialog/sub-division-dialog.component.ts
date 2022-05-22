import { ErrorMatcher } from './../../../../core/error-matcher';
import { Division } from './../../../models/division.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DivisionService } from './../../../services/division.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubDivisionRequestPayload } from './../../../models/subDivision.model';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-sub-division-dialog',
  templateUrl: './sub-division-dialog.component.html',
  styleUrls: ['./sub-division-dialog.component.scss'],
})
export class SubDivisionDialogComponent implements OnInit {
  subDivisionPayload: SubDivisionRequestPayload;
  subDivisionForm: FormGroup;
  divisions: Division[];

  errorMatcher = new ErrorMatcher();

  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SubDivisionDialogComponent>,
    private divisionService: DivisionService
  ) {
    this.subDivisionForm = this.builder.group({
      id: 0,
      name: ['', Validators.required],
      divisionId: ['', Validators.required],
    });

    if (data.subDivision) {
      this.subDivisionForm.patchValue({
        id: data.subDivision.id,
        name: data.subDivision.name,
        divisionId: data.subDivision.division.id,
      });
    }

    this.divisionService
      .findAllDivisions()
      .subscribe((resp) => (this.divisions = resp));
  }

  ngOnInit(): void {}

  save() {
    const id = this.subDivisionForm.value.id;
    this.subDivisionPayload = this.subDivisionForm.value;
    if (id) {
      this.divisionService
        .updateSubDivision(id, this.subDivisionPayload)
        .subscribe({
          next: () => this.dialogRef.close('edit'),
          error: (err) => this.toastr.error(err.error.message),
        });
    } else {
      this.divisionService
        .createSubDivision(this.subDivisionPayload)
        .subscribe({
          next: () => this.dialogRef.close('save'),
          error: (err) => this.toastr.error(err.error.message),
        });
    }
  }
}
