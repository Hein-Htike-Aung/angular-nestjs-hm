import { CreatePurchaseItemDto } from './createPurchaseItem.dto';
import { PaymentStatus } from './../entities/invoice.entity';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  purchaseDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  supplierId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  employeeId: number;

  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  paymentStatus: PaymentStatus;

  @IsString()
  @IsOptional()
  details: string;

  @ValidateNested()
  @IsArray()
  @Type(() => CreatePurchaseItemDto)
  purchaseItems?: CreatePurchaseItemDto[];
}
