import { CreateDivisionDto } from './create-division.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDivisionDto extends PartialType(CreateDivisionDto) {}
