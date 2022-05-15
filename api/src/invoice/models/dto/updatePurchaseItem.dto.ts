import { CreatePurchaseItemDto } from './createPurchaseItem.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePurchaseItemDto extends PartialType(CreatePurchaseItemDto) {}
