import { Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Supplier } from './../models/supplier.model';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

const API_URL = `${environment.API}/supplier`;

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private http: HttpClient) {}

  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${API_URL}`, supplier).pipe(take(1));
  }

  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http
      .patch<Supplier>(`${API_URL}/${id}`, supplier)
      .pipe(take(1));
  }

  deleteSupplier(id: number): Observable<Supplier> {
    return this.http.delete<Supplier>(`${API_URL}/${id}`).pipe(take(1));
  }

  findById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${API_URL}/${id}`).pipe(take(1));
  }

  findAllSupplier(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${API_URL}`);
  }
}
