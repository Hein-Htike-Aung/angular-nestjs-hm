import { CreateBookingDetials } from './create-booking-detials.dto';
import { Type } from 'class-transformer';
import {
    IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { BookingType } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  check_in_date: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  check_out_date: Date;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  paid_amount: number;

  @IsNumber()
  @IsOptional()
  due_amount: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  total: number;

  @IsEnum(BookingType)
  @IsNotEmpty()
  bookingType: BookingType;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  customerId: number;

  @IsString()
  @IsOptional()
  remark: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  paymentId: number;

  @ValidateNested()
  @IsArray()
  @Type(() => CreateBookingDetials)
  createBookingDetials?: CreateBookingDetials[];
}
