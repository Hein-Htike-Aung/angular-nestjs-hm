import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreatePositionDto } from './../models/dto/create-position.dto';
import { UpdatePositionDto } from './../models/dto/update-position.dto';
import { Position } from './../models/entities/position.entity';
import { PositionService } from './../services/position.service';

@Controller('position')
export class PositionController {
  constructor(private positionSerice: PositionService) {}

  @Post()
  createPosition(
    @Body() createPositionDto: CreatePositionDto,
  ): Observable<Position> {
    return this.positionSerice.createPosition(createPositionDto);
  }

  @Patch(':id')
  updatePosition(
    @Param('id') id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Observable<Position> {
    return this.positionSerice.updatePosition(id, updatePositionDto);
  }

  @Delete(':id')
  deletePosition(@Param('id') id: number): Observable<Position> {
    return this.positionSerice.deletePosition(id);
  }

  @Get(':id')
  findPositionById(@Param('id') id: number): Observable<Position> {
    return this.positionSerice.findPositionById(id);
  }

  @Get()
  findAllPositions(): Observable<Position[]> {
    return this.positionSerice.findAllPosition();
  }
}
