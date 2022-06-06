import { RoomType } from './room-type.model';

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface Room {
  id: number;

  room_number: String;

  room_type: RoomType;

  size: number;

  bed_numbers: number;

  room_status: RoomStatus;

  price: number;

  description: string;

  createdAt: Date;

  updatedAt: Date;
}

export interface RoomRequestPayload {
  id: number;

  room_number: String;

  roomTypeId: number;

  size: number;

  bed_numbers: number;

  room_status: RoomStatus;

  price: number;

  description: string;
}
