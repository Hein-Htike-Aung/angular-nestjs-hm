import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';
import { ContactInfo } from '../../../employee/models/dto/create-employee.dto';
import { Nationality } from '../entities/customer.entity';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => ContactInfo)
  contact: ContactInfo;

  @IsString()
  @IsOptional()
  profession?: string;

  @IsEnum(Nationality)
  @IsNotEmpty()
  nationality: Nationality;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  id_passport: string;
}
