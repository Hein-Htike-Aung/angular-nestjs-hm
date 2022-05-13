import { JwtGuard } from './auth/guards/jwt.guard';
import { AllExceptionFilter } from './shared/filters/all-exception.filter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import config from '../ormconfig';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: <string>process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
    }),
    EmployeeModule,
    AuthModule,
    InvoiceModule,
  ],
  providers: [
    // { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
})
export class AppModule {}
