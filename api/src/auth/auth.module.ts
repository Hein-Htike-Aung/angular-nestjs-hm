import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './../employee/employee.module';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { JwtGuard } from './guards/jwt.guard';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from './models/entities/user.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '3600s',
        },
      }),
    }),
    EmployeeModule,
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService, JwtGuard, RolesGuard, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
