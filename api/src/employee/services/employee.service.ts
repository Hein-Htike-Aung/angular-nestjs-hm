import { SubDivision } from './../models/entities/subDivision.entity';
import { Position } from './../models/entities/position.entity';
import { Observable, switchMap, catchError, from, take } from 'rxjs';
import { CreateEmployeeDto } from './../models/dto/create-employee.dto';
import { Employee } from './../models/entities/employee.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

export interface EmployeeServiceProvider {
  createEmployee(createEmployeeDto: CreateEmployeeDto): Observable<Employee>;
}

@Injectable()
export class EmployeeService implements EmployeeServiceProvider {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Position) private positionRepo: Repository<Position>,
    @InjectRepository(SubDivision)
    private subDivisionRepo: Repository<SubDivision>,
  ) {}

  createEmployee(createEmployeeDto: CreateEmployeeDto): Observable<Employee> {
    return this.findPositionById(createEmployeeDto.positionId).pipe(
      switchMap((position: Position) => {
        return this.findSubdivisionById(createEmployeeDto.subDivisonid).pipe(
          switchMap((subDivision: SubDivision) => {
            return from(
              this.employeeRepo.save({
                position,
                subDivision,
                ...createEmployeeDto,
              }),
            ).pipe(
              catchError((resp: QueryFailedError) => {
                if (resp.message.indexOf('duplicate key') != -1) {
                  throw new HttpException(
                    {
                      status: HttpStatus.BAD_REQUEST,
                      message: `Already Exists`,
                    },
                    HttpStatus.BAD_REQUEST,
                  );
                }
                throw new Error();
              }),
            );
          }),
        );
      }),
    );
  }

  findPositionById(positionId: number): Observable<Position> {
    return from(
      this.positionRepo.findOneOrFail({ where: { id: positionId } }),
    ).pipe(
      take(1),
      catchError((err: QueryFailedError) => {
        if (err.message.indexOf('Could not find any entity') != -1) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              message: `Position not found with id ${positionId}`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
        throw new Error();
      }),
    );
  }

  findSubdivisionById(id: number) {
    console.log(id);
    return from(this.subDivisionRepo.findOneOrFail({ where: { id } })).pipe(
      take(1),
      catchError((err: QueryFailedError) => {
        if (err.message.indexOf('Could not find any entity') != -1) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              message: `No Subdivsion found with id ${id}`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
        throw Error();
      }),
    );
  }
}
