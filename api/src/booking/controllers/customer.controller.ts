import { updateCustomerDto } from './../models/dto/update-customer.dto';
import { Observable } from 'rxjs';
import { CreateCustomerDto } from './../models/dto/create-customer.dto';
import { CustomerService } from './../services/customer.service';
import { Body, Controller, Post, Param, Patch, Get } from '@nestjs/common';
import { Customer } from '../models/entities/customer.entity';

@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  createCustomer(
    @Body() createCustomer: CreateCustomerDto,
  ): Observable<Customer> {
    return this.customerService.createCustomer(createCustomer);
  }

  @Patch(':id')
  updateCustomer(
    @Param('id') id: number,
    @Body() updateCustomer: updateCustomerDto,
  ): Observable<Customer> {
    return this.customerService.updateCustomer(id, updateCustomer);
  }

  @Get(':id')
  findCustomerById(@Param('id') id: number): Observable<Customer> {
    return this.customerService.findCustomerById(id);
  }

  @Get()
  findAllCustomer(): Observable<Customer[]> {
    return this.customerService.findAllCustomer();
  }
}
