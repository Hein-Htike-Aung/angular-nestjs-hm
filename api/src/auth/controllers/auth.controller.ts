import { RolesGuard } from './../guards/roles.guard';
import { CreateEmployeeDto } from './../../employee/models/dto/create-employee.dto';
import { ROLE, User } from './../models/entities/user.entity';
import { Employee } from './../../employee/models/entities/employee.entity';
import { Observable, tap, map } from 'rxjs';
import { AuthService } from './../services/auth.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CredentailInfo } from '../models/dto/credential-info.dto';
import { PublicRoute } from '../../shared/decorators/public-route.decorator';
import { Roles } from '../decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Post('register/employee')
  createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Observable<Employee> {
    return this.authService.registerEmployee(createEmployeeDto);
  }

  @PublicRoute()
  @Post('login')
  login(@Body() credentialInfo: CredentailInfo): Observable<{ token: string }> {
    return this.authService.login(credentialInfo);
  }

  @Roles(ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('/user/block/:id')
  blockUser(@Param('id') userId: number): Observable<User> {
    return this.authService.blockUser(userId);
  }

  @Get('/user/:id')
  findUserById(@Param('id') userId: number): Observable<User> {
    return this.authService.findUserById(userId);
  }

  @Get('users')
  findAllUsers(): Observable<User[]> {
    return this.authService.findAllUsers();
  }
}
