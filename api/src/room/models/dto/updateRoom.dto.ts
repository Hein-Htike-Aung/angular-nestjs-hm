import { CreateRoomDto } from './createRoom.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}