import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, Observable, switchMap, take } from 'rxjs';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { CreatePositionDto } from './../models/dto/create-position.dto';
import { UpdatePositionDto } from './../models/dto/update-position.dto';
import { Employee } from './../models/entities/employee.entity';
import { Position } from './../models/entities/position.entity';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position) private positionRepo: Repository<Position>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
  ) {}

  createPosition(createPositionDto: CreatePositionDto): Observable<Position> {
    return from(this.positionRepo.save(createPositionDto)).pipe(
      catchError((err: QueryFailedError) => {
        if (err.message.indexOf('duplicate key') != -1) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: 'Already exists',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        throw new Error();
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

  findAllPosition(): Observable<Position[]> {
    return from(this.positionRepo.find({ relations: ['employees'] }));
  }

  updatePosition(
    id: number,
    updatePositionDto: UpdatePositionDto,
  ): Observable<Position> {
    return this.findPositionById(id).pipe(
      switchMap((_) => {
        return from(
          this.positionRepo.update(id, { ...updatePositionDto }),
        ).pipe(
          switchMap((resp: UpdateResult) => {
            if (resp.affected != 0) {
              return this.findPositionById(id);
            }
            throw new Error();
          }),
        );
      }),
    );
  }

  deletePosition(id: number): Observable<Position> {
    return this.findPositionById(id).pipe(
      switchMap((position: Position) => {
        return this.findEmployeesByPositionId(position.id).pipe(
          switchMap((employees: Employee[]) => {
            if (employees.length == 0) {
              return this.positionRepo.remove(position);
            }

            throw new HttpException(
              {
                status: HttpStatus.NOT_ACCEPTABLE,
                message: `Position cannot be deleted`,
              },
              HttpStatus.NOT_ACCEPTABLE,
            );
          }),
        );
      }),
    );
  }

  findEmployeesByPositionId(positionId: number): Observable<Employee[]> {
    return from(
      this.employeeRepo.find({ where: { position: { id: positionId } } }),
    );
  }
}
