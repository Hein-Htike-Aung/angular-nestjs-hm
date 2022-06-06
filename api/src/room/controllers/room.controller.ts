import { UpdateRoomDto } from './../models/dto/updateRoom.dto';
import { Room } from './../models/entities/room.entity';
import { Observable } from 'rxjs';
import { CreateRoomDto } from './../models/dto/createRoom.dto';
import { RoomService } from './../services/room.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto): Observable<Room> {
    return this.roomService.createRoom(createRoomDto);
  }

  @Patch(':id')
  updateRoom(
    @Param('id') id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Observable<Room> {
    return this.roomService.updateRoom(id, updateRoomDto);
  }

  @Get(':id')
  getRoomById(@Param('id') id: number): Observable<Room> {
    return this.roomService.findRoomById(id);
  }

  @Get()
  getAllRooms(): Observable<Room[]> {
    return this.roomService.findAll();
  }
}
