import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomImageDto {
  
  @IsString()
  @IsNotEmpty()
  image: string;
}
