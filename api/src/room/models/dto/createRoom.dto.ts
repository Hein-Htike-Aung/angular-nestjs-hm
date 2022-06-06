import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RoomStatus } from '../entities/room.entity';
import { CreateRoomImageDto } from './createRoomImage.dto';
export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  room_number: string;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  bed_numbers: number;

  @IsEnum(RoomStatus)
  @IsNotEmpty()
  room_status: RoomStatus;

  @IsString()
  @IsOptional()
  description: string;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  roomTypeId: number;
}
