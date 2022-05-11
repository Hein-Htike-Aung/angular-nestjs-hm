import { CreateSubDivisionDto } from './create-subdivision.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSubDivisionDto extends PartialType(CreateSubDivisionDto) {}