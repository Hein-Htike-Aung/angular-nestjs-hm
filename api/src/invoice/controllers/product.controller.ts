import { UpdateProductDto } from './../models/dto/updateProduct.dto';
import { Product } from './../models/entities/Product.entity';
import { Observable } from 'rxjs';
import { CreateProductDto } from './../models/dto/createProduct.dto';
import { ProductService } from './../services/product.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Observable<Product> {
    return this.productService.createProduct(createProductDto);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Observable<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number): Observable<Product> {
    return this.productService.deleteProduct(id);
  }

  @Get(':id')
  findProductById(@Param('id') id: number): Observable<Product> {
    return this.productService.findProductById(id);
  }

  @Get()
  findAll(): Observable<Product[]> {
    return this.productService.findAllProducts();
  }
}
