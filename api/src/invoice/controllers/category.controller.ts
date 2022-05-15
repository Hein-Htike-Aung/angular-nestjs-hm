import { UpdateCategoryDto } from './../models/dto/updateCategory.dto';
import { Category } from './../models/entities/category.entity';
import { Observable } from 'rxjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCategoryDto } from './../models/dto/createCategory.dto';
import { CategoryService } from './../services/category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Observable<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Patch(':id')
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Observable<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: number): Observable<Category> {
    return this.categoryService.deleteCategory(id);
  }

  @Get(':id')
  getCategoryById(@Param('id') id: number): Observable<Category> {
    return this.categoryService.findCategoryById(id);
  }

  @Get()
  getAllCategories(): Observable<Category[]> {
    return this.categoryService.findAll();
  }
}
