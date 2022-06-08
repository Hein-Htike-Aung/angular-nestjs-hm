import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBookingDetials {
//   @IsOptional()
//   id?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  roomId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  personCount: number;

//   @IsNumber()
//   @IsOptional()
//   bookingId: number;
}
