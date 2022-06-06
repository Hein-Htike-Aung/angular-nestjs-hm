import { RoomImage } from './models/entities/room-image.entity';
import { Room } from './models/entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoomService } from './services/room.service';
import { RoomController } from './controllers/room.controller';
import { RoomTypeService } from './services/room-type.service';
import { RoomTypeController } from './controllers/room-type.controller';
import { RoomType } from './models/entities/room-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomImage, RoomType])],
  providers: [RoomService, RoomTypeService],
  controllers: [RoomController, RoomTypeController],
})
export class RoomModule {}
