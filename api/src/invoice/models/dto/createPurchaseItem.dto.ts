import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePurchaseItemDto {

  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  rate: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  productId: number;

  @IsNumber()
  @IsOptional()
  invoiceId: number;
}
