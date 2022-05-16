import { RoomImage } from './models/entities/room-image.entity';
import { Room } from './models/entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoomService } from './services/room.service';
import { RoomController } from './controllers/room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomImage])],
  providers: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
