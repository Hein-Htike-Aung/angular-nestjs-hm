import { Booking } from './models/entities/booking.entity';
import { Module } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { PaymentService } from './services/payment.service';
import { PaymentListService } from './services/payment-list.service';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { PaymentController } from './controllers/payment.controller';
import { PaymentListController } from './controllers/payment-list.controller';
import { BookingController } from './controllers/booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './models/entities/customer.entity';
import { Payment } from './models/entities/payment.entity';
import { BookingDetials } from './models/entities/booking-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Customer, Payment, BookingDetials])],
  providers: [
    BookingService,
    PaymentService,
    PaymentListService,
    CustomerService,
  ],
  controllers: [
    CustomerController,
    PaymentController,
    PaymentListController,
    BookingController,
  ],
})
export class BookingModule {}
