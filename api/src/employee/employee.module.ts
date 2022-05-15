import { InvoiceModule } from './../invoice/invoice.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisionController } from './controllers/division.controller';
import { EmployeeController } from './controllers/employee.controller';
import { PositionController } from './controllers/position.controller';
import { Division } from './models/entities/division.entity';
import { Employee } from './models/entities/employee.entity';
import { Position } from './models/entities/position.entity';
import { SubDivision } from './models/entities/subDivision.entity';
import { DivisionService } from './services/division.service';
import { EmployeeService } from './services/employee.service';
import { PositionService } from './services/position.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Division, Position, SubDivision, Employee]),
    forwardRef(() => InvoiceModule)
  ],
  providers: [EmployeeService, PositionService, DivisionService],
  controllers: [EmployeeController, DivisionController, PositionController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
