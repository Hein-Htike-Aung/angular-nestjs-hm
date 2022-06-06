import { Room } from './../models/room.model';
import { Observable, take } from 'rxjs';
import { RoomType } from './../models/room-type.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.API}/room`;

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  createRoomType(room: Room): Observable<Room> {
    return this.http.post<Room>(`${API_URL}`, room).pipe(take(1));
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.patch<Room>(`${API_URL}/${id}`, room).pipe(take(1));
  }

  deleteRoom(id: number): Observable<Room> {
    return this.http.delete<Room>(`${API_URL}/${id}`).pipe(take(1));
  }

  findById(id: number): Observable<Room> {
    return this.http.get<Room>(`${API_URL}/${id}`).pipe(take(1));
  }

  findAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${API_URL}`);
  }
}
