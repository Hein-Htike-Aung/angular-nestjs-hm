import { CreateSupplierDto } from './createSupplier.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
