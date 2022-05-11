import { Division } from './../models/entities/division.entity';
import { Observable } from 'rxjs';
import { CreateDivisionDto } from './../models/dto/create-division.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { DivisionService } from '../services/division.service';

@Controller('division')
export class DivisionController {
  constructor(private divisonService: DivisionService) {}

  @Post()
  create(@Body() createDivisionDto: CreateDivisionDto): Observable<Division> {
    return this.divisonService.create(createDivisionDto);
  }
}
