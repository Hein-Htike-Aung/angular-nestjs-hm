import { Position } from './../models/entities/position.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position) private positionRepo: Repository<Position>,
  ) {}
}
