import { Observable, take } from 'rxjs';
import { Invoice, InvoiceRequestPayload } from './../models/invoice.model';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

const API_URL = `${environment.API}/invoice`;

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private http: HttpClient) {}

  createInvoice(
    invoiceRequestPayload: InvoiceRequestPayload
  ): Observable<Invoice> {
    console.log(invoiceRequestPayload)
    return this.http
      .post<Invoice>(`${API_URL}`, invoiceRequestPayload)
      .pipe(take(1));
  }

  updateInvoice(
    id: number,
    invoiceRequestPayload: InvoiceRequestPayload
  ): Observable<Invoice> {
    return this.http
      .patch<Invoice>(`${API_URL}/${id}`, invoiceRequestPayload)
      .pipe(take(1));
  }

  findInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${API_URL}/${id}`).pipe(take(1));
  }

  findInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${API_URL}`);
  }
}
