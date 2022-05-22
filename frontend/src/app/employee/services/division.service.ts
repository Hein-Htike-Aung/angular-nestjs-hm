import {
  SubDivision,
  SubDivisionRequestPayload,
} from './../models/subDivision.model';
import { take, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Division } from './../models/division.model';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.API}/division`;

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
  constructor(private http: HttpClient) {}

  createDivision(division: Division): Observable<Division> {
    return this.http.post<Division>(`${API_URL}`, division).pipe(take(1));
  }

  updateDivision(divisionId: number, division: Division): Observable<Division> {
    return this.http
      .patch<Division>(`${API_URL}/${divisionId}`, division)
      .pipe(take(1));
  }

  deleteDivision(divisionId: number): Observable<Division> {
    return this.http.delete<Division>(`${API_URL}/${divisionId}`).pipe(take(1));
  }

  findDivisionById(divisionId: number): Observable<Division> {
    return this.http.get<Division>(`${API_URL}/${divisionId}`).pipe(take(1));
  }

  findAllDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(`${API_URL}`);
  }

  createSubDivision(
    subDivisionRequestPayload: SubDivisionRequestPayload
  ): Observable<SubDivision> {
    return this.http
      .post<SubDivision>(`${API_URL}/subdivision`, subDivisionRequestPayload)
      .pipe(take(1));
  }

  updateSubDivision(
    subDivisionId: number,
    subDivisionRequestPayload: SubDivisionRequestPayload
  ): Observable<SubDivision> {
    return this.http
      .patch<SubDivision>(
        `${API_URL}/subdivision/${subDivisionId}`,
        subDivisionRequestPayload
      )
      .pipe(take(1));
  }

  deleteSubDivision(subDivisionId: number): Observable<SubDivision> {
    return this.http
      .delete<SubDivision>(`${API_URL}/subdivision/${subDivisionId}`)
      .pipe(take(1));
  }

  findSubDivisionById(subDivisionId: number): Observable<SubDivision> {
    return this.http
      .get<SubDivision>(`${API_URL}/subdivision/${subDivisionId}`)
      .pipe(take(1));
  }

  findAllSubDivisions(): Observable<SubDivision[]> {
    return this.http.get<SubDivision[]>(`${API_URL}/subdivisions/list`);
  }
}
