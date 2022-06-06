import { RoomImage } from './../models/room-image';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, take } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { RoomType } from '../models/room-type.model';

const API_URL = `${environment.API}/room-type`;

@Injectable({
  providedIn: 'root',
})
export class RoomTypeService {
  constructor(private http: HttpClient) {}

  createRoomType(roomType: RoomType): Observable<RoomType> {
    return this.http.post<RoomType>(`${API_URL}`, roomType).pipe(take(1));
  }

  updateRoomType(id: number, roomType: RoomType): Observable<RoomType> {
    return this.http
      .patch<RoomType>(`${API_URL}/${id}`, roomType)
      .pipe(take(1));
  }

  deleteRoomType(id: number): Observable<RoomType> {
    return this.http.delete<RoomType>(`${API_URL}/${id}`).pipe(take(1));
  }

  findById(id: number): Observable<RoomType> {
    return this.http.get<RoomType>(`${API_URL}/${id}`).pipe(take(1));
  }

  findAllRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${API_URL}`);
  }

  addRoomImage(
    roomTypeId: number,
    formData: FormData
  ): Observable<RoomImage> {
    return this.http
      .post<RoomImage>(
        `${API_URL}/add-image/${roomTypeId}`,
        formData
      )
      .pipe(take(1));
  }

  updateRoomImage(
    roomTypeId: number,
    roomImageId: number,
    formData: FormData
  ): Observable<RoomImage> {
    return this.http
      .patch<RoomImage>(
        `${API_URL}/update-image/${roomTypeId}/${roomImageId}`,
        formData
      )
      .pipe(take(1));
  }

  findRoomActualImageByRoomImageId(roomImageId: number): Observable<string> {
    return this.http
      .get<string>(`${API_URL}/actual-image/${roomImageId}`)
      .pipe(take(1));
  }

  findRoomImageByName(imageName: string) {
    return of(`${API_URL}/room-image/${imageName}`);
  }
}
