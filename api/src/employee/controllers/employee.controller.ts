import { EmployeeService } from './../services/employee.service';
import { Controller } from '@nestjs/common';

@Controller('employee')
export class EmployeeController {
    constructor(private employeeService: EmployeeService) {}
}
