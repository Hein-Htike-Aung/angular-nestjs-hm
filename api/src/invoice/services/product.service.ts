import { InvoiceService } from './invoice.service';
import { PurchaseItem } from './../models/entities/purchase-item.entity';
import { CategoryService } from './category.service';
import { ErrorHandler } from './../../shared/utils/error.handler';
import { CreateProductDto } from './../models/dto/createProduct.dto';
import { UpdateProductDto } from './../models/dto/updateProduct.dto';
import { Body, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, take, catchError, switchMap, map } from 'rxjs';
import { from } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { Product } from './../models/entities/Product.entity';
import { Category } from '../models/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    @Inject(forwardRef(() => InvoiceService))
    private invoiceService: InvoiceService,
  ) {}

  createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Observable<Product> {
    return this.categoryService
      .findCategoryById(createProductDto.categoryId)
      .pipe(
        switchMap((category: Category) => {
          return from(
            this.productRepo.save({ category, ...createProductDto }),
          ).pipe(catchError(ErrorHandler.duplicationError()));
        }),
      );
  }

  updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Observable<Product> {
    return this.findProductById(id).pipe(
      switchMap((storedProduct) => {
        if (storedProduct.quantity < updateProductDto.destroyed)
          ErrorHandler.forbiddenAction(
            'Destroyed quantity is exceeded than available quantity',
          );

        return this.categoryService
          .findCategoryById(updateProductDto.categoryId)
          .pipe(
            switchMap((category: Category) => {
              delete updateProductDto.categoryId;
              return from(
                this.productRepo.update(id, { category, ...updateProductDto }),
              ).pipe(
                switchMap((resp: UpdateResult) => {
                  if (resp.affected != 0) return this.findProductById(id);

                  throw new Error();
                }),
              );
            }),
          );
      }),
    );
  }

  destroyedProductById(productId: number, destroyedQuantity: number) {
    return this.findProductById(productId).pipe(
      switchMap((product: Product) => {
        if (product.quantity < destroyedQuantity)
          throw ErrorHandler.forbiddenAction(
            'Destroyed Quantity is exceeded than available quantity',
          );

        delete product.purchaseItems;

        return from(
          this.productRepo.update(productId, {
            ...product,
            destroyed: product.destroyed + destroyedQuantity,
            quantity: product.quantity - destroyedQuantity,
          }),
        ).pipe(
          switchMap((resp: UpdateResult) => {
            if (resp.affected != 0) return this.findProductById(productId);
          }),
        );
      }),
    );
  }

  deleteProduct(productId: number): Observable<Product> {
    return this.findProductById(productId).pipe(
      switchMap((product: Product) => {
        return this.invoiceService.findPurchaseItemsByProductId(productId).pipe(
          switchMap((purchaseItems: PurchaseItem[]) => {
            if (purchaseItems.length === 0 && product.quantity == 0) {
              return this.productRepo.remove(product);
            }

            ErrorHandler.forbiddenDeleteAction('Product');
          }),
        );
      }),
    );
  }

  findProductById(id: number): Observable<Product> {
    return from(
      this.productRepo.findOneOrFail({
        where: { id },
        relations: ['category', 'purchaseItems'],
      }),
    ).pipe(
      take(1),
      catchError(ErrorHandler.entityNotFoundError(id, 'Product')),
    );
  }

  findAllProducts(): Observable<Product[]> {
    return from(
      this.productRepo.find({ relations: ['category', 'purchaseItems'] }),
    );
  }

  findProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return from(
      this.productRepo.find({ where: { category: { id: categoryId } } }),
    ).pipe(take(1));
  }
}
