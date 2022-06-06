import { RoomImage } from './../models/entities/room-image.entity';
import { Room } from './../models/entities/room.entity';
import { RoomService } from './room.service';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, Observable, switchMap, take, map } from 'rxjs';
import { from } from 'rxjs';
import { UpdateResult } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { ErrorHandler } from '../../shared/utils/error.handler';
import { CreateRoomTypeDto } from '../models/dto/createRoomType.dto';
import { UpdateRoomTypeDto } from '../models/dto/updateRoomType.dto';
import { RoomType } from '../models/entities/room-type.entity';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType) private roomTypeRepo: Repository<RoomType>,
    @Inject(forwardRef(() => RoomService)) private roomService: RoomService,
    @InjectRepository(RoomImage) private roomImageRepo: Repository<RoomImage>,
  ) {}

  createRoomType(createRoomTypeDto: CreateRoomTypeDto): Observable<RoomType> {
    return from(this.roomTypeRepo.save(createRoomTypeDto)).pipe(
      catchError(ErrorHandler.duplicationError()),
    );
  }

  updateRoomType(
    id: number,
    updateRoomTypeDto: UpdateRoomTypeDto,
  ): Observable<RoomType> {
    return this.findRoomTypeById(id).pipe(
      switchMap((_) => {
        return from(this.roomTypeRepo.update(id, updateRoomTypeDto)).pipe(
          switchMap((resp: UpdateResult) => {
            if (resp.affected != 0) return this.findRoomTypeById(id);
            throw Error();
          }),
        );
      }),
    );
  }

  addRoomImage(roomTypeId: number, fileName: string): Observable<RoomImage> {
    return this.findRoomTypeById(roomTypeId).pipe(
      switchMap((roomType: RoomType) => {
        return from(
          this.roomImageRepo.save({ room_type: roomType, image: fileName }),
        );
      }),
    );
  }

  updateRoomImage(
    roomTypeId: number,
    roomImageId: number,
    fileName: string,
  ): Observable<RoomImage> {
    return this.findRoomTypeById(roomTypeId).pipe(
      switchMap((room_type: RoomType) => {
        return this.findRoomImageById(roomImageId).pipe(
          switchMap((roomImage: RoomImage) => {
            return from(
              this.roomImageRepo.update(roomImageId, {
                room_type,
                image: fileName,
              }),
            ).pipe(
              switchMap((resp: UpdateResult) => {
                if (resp.affected != -1)
                  return this.findRoomImageById(roomImageId);
              }),
            );
          }),
        );
      }),
    );
  }

  findRoomTypeById(id: number): Observable<RoomType> {
    return from(
      this.roomTypeRepo.findOneOrFail({
        where: { id },
        relations: ['roomImages'],
      }),
    ).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(id, 'RoomType')),
    );
  }

  findRoomImageById(roomImageId: number): Observable<RoomImage> {
    return from(
      this.roomImageRepo.findOneOrFail({ where: { id: roomImageId } }),
    ).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(roomImageId, 'RoomImage')),
    );
  }

  findAll(): Observable<RoomType[]> {
    return from(this.roomTypeRepo.find({ relations: ['roomImages', 'rooms'] }));
  }

  delete(id: number): Observable<RoomType> {
    return this.roomService.findRoomByRoomTypeId(id).pipe(
      switchMap((rooms: Room[]) => {
        if (rooms.length === 0) {
          return this.findRoomTypeById(id).pipe(
            switchMap((roomType: RoomType) => {
              return this.roomTypeRepo.remove(roomType);
            }),
          );
        }
        ErrorHandler.forbiddenDeleteAction('Room Type');
      }),
    );
  }
}
