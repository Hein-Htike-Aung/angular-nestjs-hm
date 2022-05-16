import { CreateRoomDto } from './../models/dto/createRoom.dto';
import { RoomService } from './../services/room.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Post()
    createRoom(@Body() createRoomDto: CreateRoomDto) {
        // return this.roomService.createRoom(createRoomDto);
    }
}
