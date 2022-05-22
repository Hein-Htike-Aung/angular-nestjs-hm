import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from './../../services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit  {
  employees: Employee[] = [];
  employeesDataSource: MatTableDataSource<Employee>;
  displayColumns: string[] = [
    'id',
    'name',
    'position',
    'subDivision',
    'contact',
    'gender',
    'familyMember',
    'dob',
    'hireDate',
    'actions'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {
    this.getAllEmployees();
  }
  
  ngOnInit(): void {
  }

  filter(filterValue: string) {
    this.employeesDataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.employeesDataSource.paginator) {
      this.employeesDataSource.paginator.firstPage();
    }
  }

  getAllEmployees() {
    this.employeeService.findAllEmployees().subscribe((resp) => {
      this.employees = resp.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() ||
          Number(b?.user?.is_active) - Number(a?.user?.is_active)
      );

      this.employeesDataSource = new MatTableDataSource(this.employees);
      this.employeesDataSource.sort = this.sort;
      this.employeesDataSource.paginator = this.paginator;
    });
  }
}
