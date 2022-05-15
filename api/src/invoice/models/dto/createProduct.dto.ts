import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity: number;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsNumber()
  @Min(0)
  categoryId: number;
}
