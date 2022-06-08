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

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
