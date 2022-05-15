import { CreateInvoiceDto } from './createInvoice.dto';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested
} from 'class-validator';
import { PaymentStatus } from '../entities/invoice.entity';
import { CreatePurchaseItemDto } from './createPurchaseItem.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  // @IsDate()
  // @IsNotEmpty()
  // @Type(() => Date)
  // purchaseDate?: Date;

  // @IsNumber()
  // @IsNotEmpty()
  // @Min(0)
  // supplierId?: number;

  // @IsNumber()
  // @IsNotEmpty()
  // @Min(0)
  // employeeId?: number;

  // @IsEnum(PaymentStatus)
  // @IsNotEmpty()
  // paymentStatus?: PaymentStatus;

  // @IsString()
  // @IsOptional()
  // details?: string;

  // @ValidateNested()
  // @IsArray()
  // @Type(() => CreatePurchaseItemDto)
  // createPurchaseItemDto?: CreatePurchaseItemDto[];
}
