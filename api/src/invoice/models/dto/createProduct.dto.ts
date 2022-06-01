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
  is_active: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  destroyed: number;

  @IsNumber()
  @Min(0)
  categoryId: number;
}
