import { RoomType } from './../models/entities/room-type.entity';
import { RoomTypeService } from './room-type.service';
import { UpdateRoomDto } from './../models/dto/updateRoom.dto';
import { ErrorHandler } from './../../shared/utils/error.handler';
import { Observable, catchError, take, switchMap } from 'rxjs';
import { from } from 'rxjs';
import { CreateRoomDto } from './../models/dto/createRoom.dto';
import { Room } from './../models/entities/room.entity';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @Inject(forwardRef(() => RoomTypeService))
    private roomTypeService: RoomTypeService,
  ) {}

  createRoom(createRoomDto: CreateRoomDto): Observable<Room> {
    return this.roomTypeService.findRoomTypeById(createRoomDto.roomTypeId).pipe(
      switchMap((room_type: RoomType) => {
        return from(this.roomRepo.save({ room_type, ...createRoomDto })).pipe(
          catchError(ErrorHandler.duplicationError()),
        );
      }),
    );
  }

  updateRoom(id: number, updateRoomDto: UpdateRoomDto): Observable<Room> {
    return this.roomTypeService.findRoomTypeById(updateRoomDto.roomTypeId).pipe(
      switchMap((room_type: RoomType) => {
        return this.findRoomById(id).pipe(
          switchMap((_) => {
            delete updateRoomDto.roomTypeId;
            return from(
              this.roomRepo.update(id, { room_type, ...updateRoomDto }),
            ).pipe(
              switchMap((resp: UpdateResult) => {
                if (resp.affected != 0) return this.findRoomById(id);

                throw Error();
              }),
            );
          }),
        );
      }),
    );
  }

  findRoomById(id: number): Observable<Room> {
    return from(this.roomRepo.findOneOrFail({ where: { id } })).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(id, 'Room')),
    );
  }

  findRoomByRoomTypeId(id: number): Observable<Room[]> {
    return from(this.roomRepo.find({ where: { room_type: { id } } })).pipe(
      take(1),
    );
  }

  findAll(): Observable<Room[]> {
    return from(this.roomRepo.find({ relations: ['room_type'] }));
  }

  // TODO: Delete
}
