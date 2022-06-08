import { ErrorHandler } from './../../shared/utils/error.handler';
import { Observable, catchError, take, switchMap } from 'rxjs';
import { from } from 'rxjs';
import { BookingService } from './booking.service';
import { Customer } from './../models/entities/customer.entity';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCustomerDto } from '../models/dto/create-customer.dto';
import { updateCustomerDto } from '../models/dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @Inject(forwardRef(() => BookingService))
    private bookingService: BookingService,
  ) {}

  createCustomer(createCustomerDto: CreateCustomerDto): Observable<Customer> {
    return from(this.customerRepo.save(createCustomerDto)).pipe(
      catchError(ErrorHandler.duplicationError()),
    );
  }

  updateCustomer(
    id: number,
    updateCustomerDto: updateCustomerDto,
  ): Observable<Customer> {
    return this.findCustomerById(id).pipe(
      switchMap((_) => {
        return from(this.customerRepo.update(id, updateCustomerDto)).pipe(
          switchMap((resp: UpdateResult) => {
            if (resp.affected != 0) {
              return this.findCustomerById(id);
            }
            throw new Error();
          }),
        );
      }),
    );
  }

  findCustomerById(id: number): Observable<Customer> {
    return from(
      this.customerRepo.findOneOrFail({
        where: { id },
        relations: ['bookings'],
      }),
    ).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(id, 'Customer')),
    );
  }

  findAllCustomer(): Observable<Customer[]> {
    return from(this.customerRepo.find({ relations: ['bookings'] }));
  }

  // TODO: Delete
}
