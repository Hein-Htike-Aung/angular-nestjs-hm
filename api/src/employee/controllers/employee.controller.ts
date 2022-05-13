import { UpdateEmployeeDto } from './../models/dto/update-employee.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateEmployeeDto } from './../models/dto/create-employee.dto';
import { Employee } from './../models/entities/employee.entity';
import { EmployeeService } from './../services/employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Patch('update/:id')
  updateEmployee(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Observable<Employee> {
    return this.employeeService.updateEmployee(id, updateEmployeeDto);
  }

  @Get(':id')
  findById(@Param('id') id: number): Observable<Employee> {
    return this.employeeService.findEmployeeById(id);
  }

  @Get()
  findAllEmployee(): Observable<Employee[]> {
    return this.employeeService.findAllEmployee();
  }
}
