import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RoomStatus, RoomType } from './../entities/room.entity';
import { CreateRoomImageDto } from './createRoomImage.dto';
export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  room_number: string;

  @IsEnum(RoomType)
  room_type: RoomType;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  bed_numbers: number;

  @IsEnum(RoomStatus)
  room_status: RoomStatus;

  @IsString()
  @IsOptional()
  description: string;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsArray()
  createRoomImageDto: CreateRoomImageDto[];
}
