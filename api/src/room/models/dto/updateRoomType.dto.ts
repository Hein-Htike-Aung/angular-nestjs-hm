import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomTypeDto } from './createRoomType.dto';

export class UpdateRoomTypeDto extends PartialType(CreateRoomTypeDto) {}