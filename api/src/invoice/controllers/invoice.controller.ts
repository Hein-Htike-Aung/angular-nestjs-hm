import { UpdateInvoiceDto } from './../models/dto/updateInvoice.dto';
import { Observable } from 'rxjs';
import { CreateInvoiceDto } from './../models/dto/createInvoice.dto';
import { InvoiceService } from './../services/invoice.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Invoice } from '../models/entities/invoice.entity';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post()
  createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Observable<Invoice> {
    return this.invoiceService.saveInvoice(createInvoiceDto);
  }

  @Patch(':id')
  updateInvoice(
    @Param('id') id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Observable<Invoice> {
    return this.invoiceService.saveInvoice(updateInvoiceDto, id);
  }

  @Get(':id')
  findInvoiceById(@Param('id') id: number): Observable<Invoice> {
    return this.invoiceService.findInvoiceById(id);
  }

  @Get()
  findAllInvoices(): Observable<Invoice[]> {
    return this.invoiceService.findAllInvoices();
  }
}
