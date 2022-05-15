import { CreateCategoryDto } from './createCategory.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
