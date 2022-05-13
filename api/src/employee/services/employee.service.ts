import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, Observable, switchMap, take } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { ErrorHandler } from './../../shared/utils/error.handler';
import { CreateEmployeeDto } from './../models/dto/create-employee.dto';
import { UpdateEmployeeDto } from './../models/dto/update-employee.dto';
import { Employee } from './../models/entities/employee.entity';
import { Position } from './../models/entities/position.entity';
import { SubDivision } from './../models/entities/subDivision.entity';
import { DivisionService } from './division.service';
import { PositionService } from './position.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @Inject(forwardRef(() => DivisionService))
    private divisionService: DivisionService,
    @Inject(forwardRef(() => PositionService))
    private positionService: PositionService,
  ) {}

  createEmployee(createEmployeeDto: CreateEmployeeDto): Observable<Employee> {
    return this.positionService
      .findPositionById(createEmployeeDto.positionId)
      .pipe(
        switchMap((position: Position) => {
          return this.divisionService
            .findSubdivisionById(createEmployeeDto.subDivisonid)
            .pipe(
              switchMap((subDivision: SubDivision) => {
                return from(
                  this.employeeRepo.save({
                    position,
                    subDivision,
                    ...createEmployeeDto,
                  }),
                ).pipe(catchError(ErrorHandler.duplicationError()));
              }),
            );
        }),
      );
  }

  updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Observable<Employee> {
    return this.findEmployeeById(id).pipe(
      switchMap((_) => {
        return this.positionService
          .findPositionById(updateEmployeeDto.positionId)
          .pipe(
            switchMap((position: Position) => {
              return this.divisionService
                .findSubdivisionById(updateEmployeeDto.subDivisonid)
                .pipe(
                  switchMap((subDivision: SubDivision) => {
                    delete updateEmployeeDto.positionId;
                    delete updateEmployeeDto.subDivisonid;
                    return from(
                      this.employeeRepo.update(id, {
                        position,
                        subDivision,
                        ...updateEmployeeDto,
                      }),
                    ).pipe(
                      switchMap((resp: UpdateResult) => {
                        if (resp.affected != 0)
                          return this.findEmployeeById(id);

                        throw new Error();
                      }),
                    );
                  }),
                );
            }),
          );
      }),
    );
  }

  findEmployeeById(id: number): Observable<Employee> {
    return from(
      this.employeeRepo.findOneOrFail({
        where: { id },
        relations: ['position', 'subDivision'],
      }),
    ).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(id, 'Employoee')),
    );
  }

  findAllEmployee(): Observable<Employee[]> {
    return from(
      this.employeeRepo.find({ relations: ['position', 'subDivision'] }),
    );
  }

  findEmployeesByPositionId(positionId: number): Observable<Employee[]> {
    return from(
      this.employeeRepo.find({ where: { position: { id: positionId } } }),
    );
  }

  findEmployeeBySubDivisionId(subDivisionId: number): Observable<Employee[]> {
    return from(
      this.employeeRepo.find({ where: { subDivision: { id: subDivisionId } } }),
    );
  }
}
