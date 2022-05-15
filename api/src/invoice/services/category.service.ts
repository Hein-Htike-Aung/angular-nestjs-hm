import { Product } from './../models/entities/Product.entity';
import { ProductService } from './product.service';
import { ErrorHandler } from './../../shared/utils/error.handler';
import { UpdateCategoryDto } from './../models/dto/updateCategory.dto';
import { Observable, catchError, map, switchMap, take } from 'rxjs';
import { from } from 'rxjs';
import { CreateCategoryDto } from './../models/dto/createCategory.dto';
import { Category } from './../models/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  createCategory(createCategoryDto: CreateCategoryDto): Observable<Category> {
    return from(this.categoryRepo.save(createCategoryDto)).pipe(
      catchError(ErrorHandler.duplicationError()),
    );
  }

  updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Observable<Category> {
    return this.findCategoryById(id).pipe(
      switchMap((_) => {
        return from(this.categoryRepo.update(id, updateCategoryDto)).pipe(
          switchMap((resp: UpdateResult) => {
            if (resp.affected != 0) {
              return this.findCategoryById(id);
            }
            throw new Error();
          }),
        );
      }),
    );
  }

  deleteCategory(id: number): Observable<Category> {
    return this.productService.findProductsByCategoryId(id).pipe(
      switchMap((products: Product[]) => {
        if (products.length === 0) {
          return this.findCategoryById(id).pipe(
            switchMap((category: Category) => {
              return this.categoryRepo.remove(category);
            }),
          );
        }
        ErrorHandler.forbiddenDeleteAction('Category');
      }),
    );
  }

  findCategoryById(id: number): Observable<Category> {
    return from(
      this.categoryRepo.findOneOrFail({
        where: { id },
        relations: ['products'],
      }),
    ).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(id, 'Category')),
    );
  }

  findAll(): Observable<Category[]> {
    return from(this.categoryRepo.find({ relations: ['products'] }));
  }
}
