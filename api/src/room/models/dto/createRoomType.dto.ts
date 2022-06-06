import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  @IsNotEmpty()
  roomType: string;
}
