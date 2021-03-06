import { ValidateNested } from 'class-validator';
import { IsBoolean, IsEmail, IsNumber, IsOptional, Min } from 'class-validator';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNull } from 'typeorm';
import { ROLE, User } from '../../../auth/models/entities/user.entity';
import { GENDER } from '../entities/employee.entity';

export class ContactInfo {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsArray()
  familyMember?: string[];

  @ValidateNested()
  @Type(() => ContactInfo)
  contact: ContactInfo;

  @IsString()
  @IsNotEmpty()
  address: string;
  
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dob: Date;
  
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  hireDate: Date;
  
  @IsEnum(GENDER)
  @IsNotEmpty()
  gender: GENDER;
  
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  positionId: number;
  
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  subDivisonId: number;
  
  // @IsObject()
  // @IsOptional()
  // image?: FormData;
  
  @IsEnum(ROLE)
  @IsOptional()
  role: ROLE;
  
  @IsString()
  @IsOptional()
  username?: string;
  
  @IsString()
  @IsOptional()
  password?: string;
  
  @IsBoolean()
  @IsOptional()
  is_Active?: boolean;

  @IsOptional()
  user?: User;
}
