import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoomImageDto {
  
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  roomTypeId: number;
}
