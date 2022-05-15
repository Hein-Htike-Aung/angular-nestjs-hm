import { ErrorHandler } from './../../shared/utils/error.handler';
import { Supplier } from './../models/entities/supplier.entity';
import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSupplierDto } from '../models/dto/createSupplier.dto';
import { Observable, take, catchError, switchMap } from 'rxjs';
import { from } from 'rxjs';
import { UpdateSubDivisionDto } from '../../employee/models/dto/update-subdivision.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier) private supplierRepo: Repository<Supplier>,
  ) {}

  createSupplier(createSupplierDto: CreateSupplierDto): Observable<Supplier> {
    return from(this.supplierRepo.save(createSupplierDto)).pipe(
      catchError(ErrorHandler.duplicationError()),
    );
  }

  updateSupplier(
    id: number,
    updateSupplierDto: UpdateSubDivisionDto,
  ): Observable<Supplier> {
    return this.findSupplierById(id).pipe(
      switchMap((supplier: Supplier) => {
        return from(this.supplierRepo.update(id, updateSupplierDto)).pipe(
          switchMap((resp: UpdateResult) => {
            if (resp.affected != 0) {
              return this.findSupplierById(id);
            }
          }),
        );
      }),
    );
  }

  deleteSupplier(id: number): Observable<Supplier> {
    return this.findSupplierById(id).pipe(
      switchMap((supplier: Supplier) => {
        return this.supplierRepo.remove(supplier);
      }),
    );
  }

  findSupplierById(id: number): Observable<Supplier> {
    return from(this.supplierRepo.findOneOrFail({ where: { id } })).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(id, 'Supplier')),
    );
  }

  findAllSuppliers(): Observable<Supplier[]> {
    return from(this.supplierRepo.find({ relations: ['invoices'] }));
  }
}
