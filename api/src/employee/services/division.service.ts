import { UpdateSubDivisionDto } from './../models/dto/update-subdivision.dto';
import { create } from 'domain';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, of, switchMap, take } from 'rxjs';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { CreateDivisionDto } from './../models/dto/create-division.dto';
import { CreateSubDivisionDto } from './../models/dto/create-subdivision.dto';
import { UpdateDivisionDto } from './../models/dto/update-division.dto';
import { Division } from './../models/entities/division.entity';
import { SubDivision } from './../models/entities/subDivision.entity';
import { Employee } from '../models/entities/employee.entity';

@Injectable()
export class DivisionService {
  constructor(
    @InjectRepository(Division) private divisionRepo: Repository<Division>,
    @InjectRepository(SubDivision)
    private subDivisionRepo: Repository<SubDivision>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
  ) {}

  createDivision(createDivisionDto: CreateDivisionDto): Observable<Division> {
    return from(this.divisionRepo.save(createDivisionDto)).pipe(
      catchError((err: QueryFailedError) => {
        if (err.message.indexOf('duplicate key') != -1) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: 'Already Exists',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        throw new Error();
      }),
    );
  }

  updateDivision(
    id: number,
    updateDivisionDto: UpdateDivisionDto,
  ): Observable<Division> {
    return this.findDivisionById(id).pipe(
      switchMap((division: Division) => {
        return from(this.divisionRepo.update(id, updateDivisionDto)).pipe(
          switchMap((resp: UpdateResult) => {
            if (resp.affected != 0) {
              return of(division);
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
      catchError((err: QueryFailedError) => {
        if (err.message.indexOf('Could not find any entity') != -1) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              message: `Division not found with id ${id}`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
        throw Error();
      }),
    );
  }

  deleteDivision(id: number): Observable<Division> {
    return this.findDivisionById(id).pipe(
      switchMap((division: Division) => {
        return this.findSubDivisionbyDivisionId(division.id).pipe(
          switchMap((subDivision: SubDivision) => {
            if (subDivision) {
              throw new HttpException(
                {
                  status: HttpStatus.NOT_ACCEPTABLE,
                  message: `Division cannot be deleted`,
                },
                HttpStatus.NOT_ACCEPTABLE,
              );
            }

            return this.divisionRepo.remove(division);
          }),
        );
      }),
    );
  }

  deleteSubDivisionById(subDivisionId: number): Observable<SubDivision> {
    return this.findSubdivisionById(subDivisionId).pipe(
      switchMap((subDivision: SubDivision) => {
        return this.findEmployeeBySubDivisionId(subDivisionId).pipe(
          switchMap((employees: Employee[]) => {
            if (employees.length == 0) {
              return this.subDivisionRepo.remove(subDivision);
            }
            throw new HttpException(
              {
                status: HttpStatus.NOT_ACCEPTABLE,
                message: `Subdivision cannot be deleted`,
              },
              HttpStatus.NOT_ACCEPTABLE,
            );
          }),
        );
      }),
    );
  }

  findEmployeeBySubDivisionId(subDivisionId: number): Observable<Employee[]> {
    return from(
      this.employeeRepo.find({ where: { subDivision: { id: subDivisionId } } }),
    );
  }

  findSubDivisionbyDivisionId(divisionId: number): Observable<SubDivision> {
    return from(
      this.subDivisionRepo.findOne({ where: { division: { id: divisionId } } }),
    ).pipe(take(1));
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

  createSubDivision(
    createSubDivision: CreateSubDivisionDto,
  ): Observable<SubDivision> {
    return this.findDivisionById(createSubDivision.divisionId).pipe(
      switchMap((division: Division) => {
        return from(
          this.subDivisionRepo.save({ division, ...createSubDivision }),
        ).pipe(
          catchError((err: QueryFailedError) => {
            if (err.message.indexOf('duplicate key') != -1)
              throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  message: 'already exists',
                },
                HttpStatus.BAD_REQUEST,
              );
            throw Error();
          }),
        );
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

  findAllDivisions(): Observable<Division[]> {
    return from(this.divisionRepo.find({ relations: ['subDivisions'] }));
  }

  findAllSubDivisions(): Observable<SubDivision[]> {
    return from(
      this.subDivisionRepo.find({ relations: ['division', 'employees'] }),
    );
  }
}
