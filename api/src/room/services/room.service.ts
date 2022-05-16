import { Room } from './../models/entities/room.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(@InjectRepository(Room) private roomRepo: Repository<Room>) {}

  
}
