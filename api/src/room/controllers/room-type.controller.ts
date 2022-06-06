import { Observable, of, switchMap } from 'rxjs';
import { RoomTypeService } from './../services/room-type.service';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateRoomTypeDto } from '../models/dto/createRoomType.dto';
import { RoomType } from '../models/entities/room-type.entity';
import { UpdateRoomTypeDto } from '../models/dto/updateRoomType.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageStorage } from '../../shared/utils/image-storage';
import { join } from 'path';
import { ErrorHandler } from '../../shared/utils/error.handler';

@Controller('room-type')
export class RoomTypeController {
  constructor(private roomTypeService: RoomTypeService) {}

  @Post()
  createRoomtype(
    @Body() createRoomTypeDto: CreateRoomTypeDto,
  ): Observable<RoomType> {
    return this.roomTypeService.createRoomType(createRoomTypeDto);
  }

  @Patch(':id')
  updateRoomtype(
    @Param('id') id: number,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
  ): Observable<RoomType> {
    return this.roomTypeService.updateRoomType(id, updateRoomTypeDto);
  }

  @Get(':id')
  getRoomTypeById(@Param('id') id: number): Observable<RoomType> {
    return this.roomTypeService.findRoomTypeById(id);
  }

  @Get()
  getAllRooms(): Observable<RoomType[]> {
    return this.roomTypeService.findAll();
  }

  /* Room Image */
  @Post('add-image/:roomTypeId')
  @UseInterceptors(FileInterceptor('file', ImageStorage.saveImage()))
  addRoomImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('roomTypeId') roomTypeId: number,
  ): Observable<
    | {
        error: string;
      }
    | {
        modifiedFileName: string;
      }
  > {
    const fileName = file?.filename;
    // fileName = 94099d67-5992-42ec-9e42-b7c594c5ee93.png

    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), `images`);
    const imagePath = join(imagesFolderPath + '/', file.filename);
    // imagePath = D:\angular\angular-journey\hm\api\images\94099d67-5992-42ec-9e42-b7c594c5ee93.png

    return ImageStorage.isImagePathSafe(imagePath).pipe(
      switchMap((isFileLegit) => {
        if (isFileLegit) {
          return this.roomTypeService.addRoomImage(roomTypeId, fileName);
        }

        ImageStorage.removeFile(imagePath);
        throw ErrorHandler.throwInvalidImage();
      }),
    );
  }

  @Post('update-image/:roomTypeId/:roomImageId')
  @UseInterceptors(FileInterceptor('file', ImageStorage.saveImage()))
  updateRoomImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('roomTypeId') roomTypeId: number,
    @Param('roomImageId') roomImageId: number,
  ): Observable<
    | {
        error: string;
      }
    | {
        modifiedFileName: string;
      }
  > {
    const fileName = file?.filename;
    // fileName = 94099d67-5992-42ec-9e42-b7c594c5ee93.png

    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), `images`);
    const imagePath = join(imagesFolderPath + '/', file.filename);
    // imagePath = D:\angular\angular-journey\hm\api\images\94099d67-5992-42ec-9e42-b7c594c5ee93.png

    return ImageStorage.isImagePathSafe(imagePath).pipe(
      switchMap((isFileLegit) => {
        if (isFileLegit) {
          return this.roomTypeService.addRoomImage(roomTypeId, fileName);
        }

        ImageStorage.removeFile(imagePath);
        throw ErrorHandler.throwInvalidImage();
      }),
    );
  }
}
