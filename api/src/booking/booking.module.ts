import { Module } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { PaymentService } from './services/payment.service';
import { PaymentListService } from './services/payment-list.service';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { PaymentController } from './controllers/payment.controller';
import { PaymentListController } from './controllers/payment-list.controller';
import { BookingController } from './controllers/booking.controller';

@Module({
  providers: [BookingService, PaymentService, PaymentListService, CustomerService],
  controllers: [CustomerController, PaymentController, PaymentListController, BookingController]
})
export class BookingModule {}
