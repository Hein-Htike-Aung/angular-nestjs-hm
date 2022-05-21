import { take, Observable } from 'rxjs';
import { Position } from './../models/position.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

const API_URL = `${environment.API}/position`;

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  createPosition(position: Position): Observable<Position> {
    return this.http
      .post<Position>(`${API_URL}`, position, this.httpOptions)
      .pipe(take(1));
  }

  updatePosition(positionId: number, position: Position): Observable<Position> {
    return this.http
      .patch<Position>(`${API_URL}/${positionId}`, position, this.httpOptions)
      .pipe(take(1));
  }

  deletePosition(positionId: number): Observable<Position> {
    return this.http.delete<Position>(`${API_URL}/${positionId}`).pipe(take(1));
  }

  findPositionById(positionId: number): Observable<Position> {
    return this.http.get<Position>(`${API_URL}/${positionId}`).pipe(take(1));
  }

  findAllPosition(): Observable<Position[]> {
    return this.http.get<Position[]>(`${API_URL}`);
  }
}
