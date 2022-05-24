import { Employee } from './../../../models/employee.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from './../../../services/employee.service';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-details-dialog',
  templateUrl: './employee-details-dialog.component.html',
  styleUrls: ['./employee-details-dialog.component.scss'],
})
export class EmployeeDetailsDialogComponent implements OnInit {
  imageUrl = '../../../../../assets/images/default-image.png';
  employee: Employee;

  constructor(
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<EmployeeDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data.employee) {
      this.employee = data.employee;
      if(this.employee.image) {
        this.employeeService
        .findEmployeeImageByName(this.employee.image)
        .subscribe((resp) => (this.imageUrl = resp));
      }
    }
  }

  ngOnInit(): void {}
}
