import { AuthService } from './../../auth/services/auth.service';
import { User } from './../../auth/models/entities/user.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  catchError,
  Observable,
  switchMap,
  take,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { from } from 'rxjs';
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
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  createEmployee(createEmployeeDto: CreateEmployeeDto): Observable<Employee> {
    return this.positionService
      .findPositionById(createEmployeeDto.positionId)
      .pipe(
        switchMap((position: Position) => {
          return this.divisionService
            .findSubdivisionById(createEmployeeDto.subDivisonId)
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
    return this.checkValidationForUpdateEmployee(id, updateEmployeeDto).pipe(
      switchMap(({ position, subDivision }) => {
        // Update Employee with Username
        if (updateEmployeeDto?.username) {
          return this.findUsernameByEmployeeId(id).pipe(
            switchMap((username: string) => {
              if (username) {
                // Update already existed Username
                return this.authService.findUserWithUsername(username).pipe(
                  tap((user: User) => {
                    this.userRepo.update(user.id, {
                      username: updateEmployeeDto.username,
                    });
                  }),
                  switchMap(() => {
                    delete updateEmployeeDto.username;
                    delete updateEmployeeDto.password;
                    return this.actual_updateEmployee(
                      id,
                      position,
                      subDivision,
                      updateEmployeeDto,
                    );
                  }),
                );
              } else {
                // Update New Username to employee
                return from(
                  this.userRepo.save({
                    username: updateEmployeeDto.username,
                    password: updateEmployeeDto.password,
                  }),
                ).pipe(
                  switchMap((user: User) => {
                    delete updateEmployeeDto.username;
                    delete updateEmployeeDto.password;
                    return from(
                      this.employeeRepo.update(id, {
                        position,
                        subDivision,
                        user,
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
                  catchError(ErrorHandler.duplicationError()),
                );
              }
            }),
          );
        } else {
          // Update Employee without user
          return this.actual_updateEmployee(
            id,
            position,
            subDivision,
            updateEmployeeDto,
          );
        }
      }),
    );
  }

  checkValidationForUpdateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Observable<{
    position: Position;
    subDivision: SubDivision;
  }> {
    return this.findEmployeeById(id).pipe(
      switchMap((_) => {
        return this.positionService
          .findPositionById(updateEmployeeDto.positionId)
          .pipe(
            switchMap((position: Position) => {
              return this.divisionService
                .findSubdivisionById(updateEmployeeDto.subDivisonId)
                .pipe(
                  switchMap((subDivision: SubDivision) => {
                    delete updateEmployeeDto.positionId;
                    delete updateEmployeeDto.subDivisonId;

                    return of({ position, subDivision });
                  }),
                );
            }),
          );
      }),
    );
  }

  actual_updateEmployee(
    id: number,
    position: Position,
    subDivision: SubDivision,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Observable<Employee> {
    return from(
      this.employeeRepo.update(id, {
        position,
        subDivision,
        ...updateEmployeeDto,
      }),
    ).pipe(
      switchMap((resp: UpdateResult) => {
        if (resp.affected != 0) return this.findEmployeeById(id);

        throw new Error();
      }),
    );
  }

  findUsernameByEmployeeId(employeeId: number): Observable<string> {
    return this.findEmployeeById(employeeId).pipe(
      switchMap((employee: Employee) => {
        if (employee?.user) {
          return this.authService.findUserById(employee?.user?.id).pipe(
            map((user: User) => {
              return user.username;
            }),
          );
        }
        return of('');
      }),
    );
  }

  findEmployeeByUserId(userId: number): Observable<Employee> {
    return from(
      this.employeeRepo.findOne({ where: { user: { id: userId } } }),
    ).pipe(take(1));
  }

  uploadEmployeeImage(
    employeeId: number,
    fileName: string,
  ): Observable<{ modifiedFileName: string }> {
    return this.findEmployeeById(employeeId).pipe(
      switchMap((_) => {
        return from(
          this.employeeRepo.update(employeeId, { image: fileName }),
        ).pipe(
          map((resp: UpdateResult) => {
            if (resp.affected != -1) return { modifiedFileName: fileName };
          }),
        );
      }),
    );
  }

  findEmployeeImageNameById(
    employeeId: number,
  ): Observable<{ imageName: string }> {
    return this.findEmployeeById(employeeId).pipe(
      switchMap((_) => {
        return from(
          this.employeeRepo.findOne({ where: { id: employeeId } }),
        ).pipe(
          take(1),
          map((employee: Employee) => {
            return { imageName: employee.image };
          }),
        );
      }),
    );
  }

  findEmployeeById(id: number): Observable<Employee> {
    return from(
      this.employeeRepo.findOneOrFail({
        where: { id },
        relations: ['position', 'subDivision', 'user'],
      }),
    ).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(id, 'Employoee')),
    );
  }

  findAllEmployee(): Observable<Employee[]> {
    return from(
      this.employeeRepo.find({
        relations: ['position', 'subDivision', 'user'],
      }),
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
