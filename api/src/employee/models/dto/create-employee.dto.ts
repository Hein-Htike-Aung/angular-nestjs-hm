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
import { ROlE } from './../entities/user-role.enum';
import { GENDER } from './../entities/employee.entity';
import { Type } from 'class-transformer';
import { IsNull } from 'typeorm';

class ContactInfo {
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
  contact: {
    phone: string;
    email: string;
  };
  
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
  subDivisonid: number;
  
  @IsString()
  @IsOptional()
  image?: string;
  
  @IsEnum(ROlE)
  role: ROlE;
  
  @IsString()
  @IsOptional()
  username?: string;
  
  @IsString()
  @IsOptional()
  password?: string;
  
  @IsBoolean()
  @IsOptional()
  is_Active: boolean;
}
