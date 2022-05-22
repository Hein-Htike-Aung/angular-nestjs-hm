import { Observable, take } from 'rxjs';
import { Employee, EmployeeRequestPayload } from './../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.API}/employee`;

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  createEmployee(
    employeeRequestPayload: EmployeeRequestPayload
  ): Observable<Employee> {
    return this.http
      .post<Employee>(
        `${environment.API}/auth/register/employee`,
        employeeRequestPayload
      )
      .pipe(take(1));
  }

  updateEmployee(
    employeeId: number,
    employeeRequestPayload: EmployeeRequestPayload
  ): Observable<Employee> {
    return this.http
      .patch<Employee>(
        `${API_URL}/update/${employeeId}`,
        employeeRequestPayload
      )
      .pipe(take(1));
  }

  findEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${API_URL}/${employeeId}`).pipe(take(1));
  }

  findAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${API_URL}`);
  }
}