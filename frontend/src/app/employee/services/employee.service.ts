import { Observable, of, take } from 'rxjs';
import { Employee, EmployeeRequestPayload } from './../models/employee.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../../auth/models/user.model';

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

  uploadEmployeeImage(
    employeeId: number,
    formData: FormData
  ): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(
        `${API_URL}/upload-image/${employeeId}`,
        formData
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

  blockEmployee(userId: number): Observable<User> {
    return this.http
      .patch<User>(`${environment.API}/auth/user/block/${userId}`, {})
      .pipe(take(1));
  }

  findEmployeeImageByName(imageName: string): Observable<string> {
    return of(`${API_URL}/image/${imageName}`);
  } 

  findEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${API_URL}/${employeeId}`).pipe(take(1));
  }

  findEmployeeByUserId(userId: number): Observable<Employee> {
    return this.http
      .get<Employee>(`${API_URL}/by-userId/${userId}`)
      .pipe(take(1));
  }

  findAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${API_URL}`);
  }
}
