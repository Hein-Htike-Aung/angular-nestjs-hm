import { ErrorHandler } from './../../shared/utils/error.handler';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, Observable, switchMap, take } from 'rxjs';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { CreatePositionDto } from './../models/dto/create-position.dto';
import { UpdatePositionDto } from './../models/dto/update-position.dto';
import { Employee } from './../models/entities/employee.entity';
import { Position } from './../models/entities/position.entity';
import { EmployeeService } from './employee.service';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position) private positionRepo: Repository<Position>,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
  ) {}

  createPosition(createPositionDto: CreatePositionDto): Observable<Position> {
    return from(this.positionRepo.save(createPositionDto)).pipe(
      catchError(ErrorHandler.duplicationError()),
    );
  }

  findPositionById(positionId: number): Observable<Position> {
    return from(
      this.positionRepo.findOneOrFail({ where: { id: positionId } }),
    ).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(positionId, 'Position')),
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
        return this.employeeService.findEmployeesByPositionId(position.id).pipe(
          switchMap((employees: Employee[]) => {
            if (employees.length == 0) {
              return this.positionRepo.remove(position);
            }
            ErrorHandler.forbiddenDeleteAction(position.name);
          }),
        );
      }),
    );
  }
}
