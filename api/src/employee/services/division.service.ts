import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, take } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { Employee } from '../models/entities/employee.entity';
import { ErrorHandler } from './../../shared/utils/error.handler';
import { CreateDivisionDto } from './../models/dto/create-division.dto';
import { CreateSubDivisionDto } from './../models/dto/create-subdivision.dto';
import { UpdateDivisionDto } from './../models/dto/update-division.dto';
import { UpdateSubDivisionDto } from './../models/dto/update-subdivision.dto';
import { Division } from './../models/entities/division.entity';
import { SubDivision } from './../models/entities/subDivision.entity';
import { EmployeeService } from './employee.service';

@Injectable()
export class DivisionService {
  constructor(
    @InjectRepository(Division) private divisionRepo: Repository<Division>,
    @InjectRepository(SubDivision)
    private subDivisionRepo: Repository<SubDivision>,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
  ) {}

  createDivision(createDivisionDto: CreateDivisionDto): Observable<Division> {
    return from(this.divisionRepo.save(createDivisionDto)).pipe(
      catchError(ErrorHandler.duplicationError()),
    );
  }

  updateDivision(
    id: number,
    updateDivisionDto: UpdateDivisionDto,
  ): Observable<Division> {
    return this.findDivisionById(id).pipe(
      switchMap((_) => {
        return from(this.divisionRepo.update(id, updateDivisionDto)).pipe(
          switchMap((resp: UpdateResult) => {
            if (resp.affected != 0) {
              return this.findDivisionById(id);
            }
            throw Error();
          }),
        );
      }),
    );
  }

  findDivisionById(id: number): Observable<Division> {
    return from(this.divisionRepo.findOneOrFail({ where: { id } })).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(id, 'Division')),
    );
  }

  deleteDivision(id: number): Observable<Division> {
    return this.findDivisionById(id).pipe(
      switchMap((division: Division) => {
        return this.findSubDivisionbyDivisionId(division.id).pipe(
          switchMap((subDivision: SubDivision) => {
            if (subDivision) {
              ErrorHandler.forbiddenDeleteAction(division.name);
            }

            return this.divisionRepo.remove(division);
          }),
        );
      }),
    );
  }

  findSubDivisionbyDivisionId(divisionId: number): Observable<SubDivision> {
    return from(
      this.subDivisionRepo.findOne({ where: { division: { id: divisionId } } }),
    ).pipe(take(1));
  }

  deleteSubDivisionById(subDivisionId: number): Observable<SubDivision> {
    return this.findSubdivisionById(subDivisionId).pipe(
      switchMap((subDivision: SubDivision) => {
        return this.employeeService
          .findEmployeeBySubDivisionId(subDivisionId)
          .pipe(
            switchMap((employees: Employee[]) => {
              if (employees.length == 0) {
                return this.subDivisionRepo.remove(subDivision);
              }
              ErrorHandler.forbiddenDeleteAction(subDivision.name);
            }),
          );
      }),
    );
  }

  findSubdivisionById(id: number): Observable<SubDivision> {
    return from(this.subDivisionRepo.findOneOrFail({ where: { id } })).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(id, 'Subdivision')),
    );
  }

  createSubDivision(
    createSubDivision: CreateSubDivisionDto,
  ): Observable<SubDivision> {
    return this.findDivisionById(createSubDivision.divisionId).pipe(
      switchMap((division: Division) => {
        return from(
          this.subDivisionRepo.save({ division, ...createSubDivision }),
        ).pipe(catchError(ErrorHandler.duplicationError()));
      }),
    );
  }

  updateSubDivision(
    subDivisionId: number,
    updateSubdivision: UpdateSubDivisionDto,
  ): Observable<SubDivision> {
    return this.findDivisionById(updateSubdivision.divisionId).pipe(
      switchMap((division: Division) => {
        return this.findSubdivisionById(subDivisionId).pipe(
          switchMap((_) => {
            delete updateSubdivision.divisionId;
            return from(
              this.subDivisionRepo.update(subDivisionId, {
                division,
                ...updateSubdivision,
              }),
            ).pipe(
              switchMap((resp: UpdateResult) => {
                if (resp.affected != 0) {
                  return this.findSubdivisionById(subDivisionId);
                }
                throw Error();
              }),
            );
          }),
        );
      }),
    );
  }

  checkValidationForUpdatesubDivision(
    divisionId: number,
    subDivisionId: number,
  ) {
    return this.findDivisionById(divisionId).pipe(
      switchMap((division: Division) => {
        return this.findSubdivisionById(subDivisionId).pipe();
      }),
    );
  }

  findAllDivisions(): Observable<Division[]> {
    return from(this.divisionRepo.find({ relations: ['subDivisions'] }));
  }

  findAllSubDivisions(): Observable<SubDivision[]> {
    return from(
      this.subDivisionRepo.find({ relations: ['division', 'employees'] }),
    );
  }
}
