import { Employee } from './../models/entities/employee.entity';
import { Observable } from 'rxjs';
import { CreateEmployeeDto } from './../models/dto/create-employee.dto';
import { EmployeeService, EmployeeServiceProvider } from './../services/employee.service';
import { Body, Controller, Inject, Post } from '@nestjs/common';

@Controller('employee')
export class EmployeeController {
  constructor(@Inject('EmployeeServiceProvider') private employeeService: EmployeeServiceProvider) {}

  @Post()
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): Observable<Employee> {
    return this.employeeService.createEmployee(createEmployeeDto);
  }
}
