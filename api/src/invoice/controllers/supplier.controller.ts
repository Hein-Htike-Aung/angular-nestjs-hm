import { UpdateSubDivisionDto } from './../../employee/models/dto/update-subdivision.dto';
import { Supplier } from './../models/entities/supplier.entity';
import { Observable } from 'rxjs';
import { CreateSupplierDto } from './../models/dto/createSupplier.dto';
import { SupplierService } from './../services/supplier.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Post()
  createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Observable<Supplier> {
    return this.supplierService.createSupplier(createSupplierDto);
  }

  @Patch(':id')
  updateSupplier(
    @Param('id') id: number,
    @Body() updateSupplierDto: UpdateSubDivisionDto,
  ): Observable<Supplier> {
    return this.supplierService.updateSupplier(id, updateSupplierDto);
  }

  @Delete(':id')
  deleteSupplier(@Param('id') id: number): Observable<Supplier> {
    return this.supplierService.deleteSupplier(id);
  }

  @Get(':id')
  findSupplierById(@Param('id') id: number): Observable<Supplier> {
    return this.supplierService.findSupplierById(id);
  }

  @Get()
  findAllSuppliers(): Observable<Supplier[]> {
    return this.supplierService.findAllSuppliers();
  }
}
