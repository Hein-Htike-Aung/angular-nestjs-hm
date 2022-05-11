import { Division } from './models/entities/division.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Position } from './models/entities/position.entity';
import { SubDivision } from './models/entities/subDivision.entity';
import { Employee } from './models/entities/employee.entity';
import { EmployeeService } from './services/employee.service';
import { EmployeeController } from './controllers/employee.controller';
import { DivisionController } from './controllers/division.controller';
import { PositionController } from './controllers/position.controller';
import { PositionService } from './services/position.service';
import { DivisionService } from './services/division.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Division, Position, SubDivision, Employee]),
  ],
  providers: [EmployeeService , PositionService, DivisionService],
  controllers: [EmployeeController, DivisionController, PositionController],
})
export class EmployeeModule {}
