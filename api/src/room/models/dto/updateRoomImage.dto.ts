import { CreateRoomImageDto } from './createRoomImage.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRoomImageDto extends PartialType(CreateRoomImageDto) {}