import { RoomImage } from "./room-image";

export interface RoomType {
  id: number;
  
  roomType: string;

  roomImages: RoomImage[];

  createdAt: Date;

  updatedAt: Date;
}
