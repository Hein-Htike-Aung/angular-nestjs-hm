import { CreateBookingDetials } from './create-booking-detials.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBookingDetails extends PartialType(CreateBookingDetials) {}