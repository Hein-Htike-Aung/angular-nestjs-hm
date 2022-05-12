import { UpdateSubDivisionDto } from './../models/dto/update-subdivision.dto';
import { SubDivision } from './../models/entities/subDivision.entity';
import { CreateSubDivisionDto } from './../models/dto/create-subdivision.dto';
import { UpdateDivisionDto } from './../models/dto/update-division.dto';
import { Division } from './../models/entities/division.entity';
import { Observable } from 'rxjs';
import { CreateDivisionDto } from './../models/dto/create-division.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DivisionService } from '../services/division.service';
import { create } from 'domain';

@Controller('division')
export class DivisionController {
  constructor(private divisionService: DivisionService) {}

  @Post()
  createDivision(
    @Body() createDivisionDto: CreateDivisionDto,
  ): Observable<Division> {
    return this.divisionService.createDivision(createDivisionDto);
  }

  @Patch(':id')
  updateDivision(
    @Param('id') id: number,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ): Observable<Division> {
    return this.divisionService.updateDivision(id, updateDivisionDto);
  }

  @Get(':id')
  findDivisionById(@Param('id') id: number): Observable<Division> {
    return this.divisionService.findDivisionById(id);
  }

  @Get()
  findAllDivision(): Observable<Division[]> {
    return this.divisionService.findAllDivisions();
  }

  @Delete(':id')
  deleteDivision(@Param('id') id: number) {
    return this.divisionService.deleteDivision(id);
  }

  @Post('subdivision')
  createSubDivision(
    @Body() createSubdivisionDto: CreateSubDivisionDto,
  ): Observable<SubDivision> {
    return this.divisionService.createSubDivision(createSubdivisionDto);
  }

  @Patch('subdivision/:id')
  updateSubDivision(
    @Param('id') id: number,
    @Body() updateSubdivision: UpdateSubDivisionDto,
  ): Observable<SubDivision> {
    return this.divisionService.updateSubDivision(id, updateSubdivision);
  }

  @Get('subdivision/:id')
  findSubDivisionById(@Param('id') id: number): Observable<SubDivision> {
    return this.divisionService.findSubdivisionById(id);
  }

  @Get('subdivisions/list')
  findAllSubDivisions() {
    return this.divisionService.findAllSubDivisions();
  }

  @Delete('subdivision/:id')
  deleteSubDivisionById(@Param("id") id: number): Observable<SubDivision> {
    return this.divisionService.deleteSubDivisionById(id);
  }
}
