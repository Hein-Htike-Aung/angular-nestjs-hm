import { Observable, take } from 'rxjs';
import { Product, ProductRequestPayload } from './../models/product.model';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = `${environment.API}/product`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  createProduct(
    productRequestPaylaod: ProductRequestPayload
  ): Observable<Product> {
    return this.http
      .post<Product>(`${API_URL}`, productRequestPaylaod)
      .pipe(take(1));
  }

  updateProduct(
    id: number,
    productRequestPayload: ProductRequestPayload
  ): Observable<Product> {
    return this.http
      .patch<Product>(`${API_URL}/${id}`, productRequestPayload)
      .pipe(take(1));
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${API_URL}/${id}`).pipe(take(1));
  }

  destroyProduct(id: number, destroyedQuantity: number) {
    return this.http
      .patch(`${API_URL}/destroyed-product/${id}`, {
        destroyedQuantity,
      })
      .pipe(take(1));
  }

  findProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/by-category/${categoryId}`);
  }

  findById(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/${id}`).pipe(take(1));
  }

  findAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}`);
  }
}
