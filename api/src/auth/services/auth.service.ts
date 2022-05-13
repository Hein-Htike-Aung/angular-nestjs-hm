import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { catchError, from, map, Observable, switchMap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { CredentailInfo } from '../models/dto/credential-info.dto';
import { CreateEmployeeDto } from './../../employee/models/dto/create-employee.dto';
import { EmployeeService } from './../../employee/services/employee.service';
import { ErrorHandler } from './../../shared/utils/error.handler';
import { User } from './../models/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeeService,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  registerEmployee(createEmployeeDto: CreateEmployeeDto): Observable<any> {
    return this.hashPassword(createEmployeeDto.password).pipe(
      switchMap((hashPassword: string) => {
        return from(
          this.userRepo.save({ ...createEmployeeDto, password: hashPassword }),
        ).pipe(
          switchMap((user: User) => {
            return from(
              this.employeeService.createEmployee({
                user,
                ...createEmployeeDto,
              }),
            );
          }),
          catchError(ErrorHandler.duplicationError()),
        );
      }),
    );
  }

  hashPassword(password: string): Observable<String> {
    return from(bcrypt.hash(password, 12));
  }

  login(credetnailInfo: CredentailInfo): Observable<{ token: string }> {
    return this.validateUser(
      credetnailInfo.username,
      credetnailInfo.password,
    ).pipe(
      switchMap((user: User) => {
        return from(this.jwtService.signAsync({ user })).pipe(
          map((token: string) => {
            return { token };
          }),
        );
      }),
    );
  }

  validateUser(username: string, password: string): Observable<User> {
    return from(this.userRepo.findOne({ where: { username } })).pipe(
      switchMap((user: User) => {
        if (!user) {
          ErrorHandler.throwUnAuthorizeException();
        }

        if (!user.is_active) {
          ErrorHandler.throwUnAuthorizeException('Please contact to admin');
        }

        return from(bcrypt.compare(password, user.password)).pipe(
          map((isPasswordValid: boolean) => {
            console.log(isPasswordValid);
            if (isPasswordValid) {
              delete user.password;
              return user;
            }
            ErrorHandler.throwUnAuthorizeException();
          }),
        );
      }),
    );
  }

  blockUser(userId: number): Observable<User> {
    return this.findUserById(userId).pipe(
      switchMap((_) => {
        return from(this.userRepo.update(userId, { is_active: false })).pipe(
          switchMap((resp: UpdateResult) => {
            if (resp.affected != -1) {
              return this.findUserById(userId);
            }
          }),
        );
      }),
    );
  }

  findUserById(id: number): Observable<User> {
    return from(this.userRepo.findOneOrFail({ where: { id } })).pipe(
      map((user: User) => {
        delete user.password;
        return user;
      }),
      catchError(ErrorHandler.entityNotFoundError(id, 'User')),
    );
  }

  findAllUsers(): Observable<User[]> {
    return from(this.userRepo.find({ relations: ['employee'] })).pipe(
      map((users: User[]) => {
        users.map((u) => delete u.password);
        return users;
      }),
    );
  }
}
