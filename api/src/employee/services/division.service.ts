import { HttpExceptionResponse } from './../../../dist/src/shared/models/exception-response.d';
import { CreateDivisionDto } from './../models/dto/create-division.dto';
import { Division } from './../models/entities/division.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable()
export class DivisionService {
  constructor(
    @InjectRepository(Division) private divisionRepo: Repository<Division>,
  ) {}

  create(createDivisionDto: CreateDivisionDto): Observable<Division> {
    return from(this.divisionRepo.save(createDivisionDto)).pipe(
      catchError((err: QueryFailedError) => {
        if (err.message.indexOf('duplicate key') != 0) {
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
}
