import { CreateEmployeeDto } from './../models/dto/create-employee.dto';
import { ErrorHandler } from './../../shared/utils/error.handler';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Observable, of, switchMap } from 'rxjs';
import { User } from '../../auth/models/entities/user.entity';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ImageStorage } from './../../shared/utils/image-storage';
import { UpdateEmployeeDto } from './../models/dto/update-employee.dto';
import { Employee } from './../models/entities/employee.entity';
import { EmployeeService } from './../services/employee.service';
import { PublicRoute } from '../../shared/decorators/public-route.decorator';

@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post('upload-image/:employeeId')
  @UseInterceptors(FileInterceptor('file', ImageStorage.saveImage()))
  uploadEmployeeImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('employeeId') employeeId: number,
  ): Observable<
    | {
        error: string;
      }
    | {
        modifiedFileName: string;
      }
  > {
    const fileName = file?.filename;
    // fileName = 94099d67-5992-42ec-9e42-b7c594c5ee93.png

    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), `images`);
    const imagePath = join(imagesFolderPath + '/', file.filename);
    // imagePath = D:\angular\angular-journey\hm\api\images\94099d67-5992-42ec-9e42-b7c594c5ee93.png

    return ImageStorage.isImagePathSafe(imagePath).pipe(
      switchMap((isFileLegit) => {
        if (isFileLegit) {
          return this.employeeService.uploadEmployeeImage(employeeId, fileName);
        }

        ImageStorage.removeFile(imagePath);
        throw ErrorHandler.throwInvalidImage();
      }),
    );
  }

  @Get('image-name/:employeeId')
  findEmployeeImageNameById(
    @Param('employeeId') employeeId: number,
  ): Observable<{ imageName: string }> {
    return this.employeeService.findEmployeeImageNameById(employeeId);
  }

  @Get('actual-image/:employeeId')
  findEmloyeeActualImageById(
    @Param('employeeId') employeeId: number,
    @Res() res,
  ): Observable<Object> {
    return this.employeeService.findEmployeeImageNameById(employeeId).pipe(
      switchMap(({ imageName }) => {
        if (imageName === null) {
          ErrorHandler.throwUnexistingEmployeeImage(employeeId);
        }

        return of(res.sendFile(imageName, { root: './images' }));
      }),
    );
  }

  @Get('image/:fileName')
  @PublicRoute()
  findImageByName(@Param('fileName') fileName: string, @Res() res) {
    if (!fileName || ['null', '[null]'].includes(fileName)) return;

    return res.sendFile(fileName, { root: './images' });
  }

  
  @Patch('update/:id')
  updateEmployee(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Observable<Employee> {
    return this.employeeService.updateEmployee(id, updateEmployeeDto);
  }

  @Get(':id')
  findById(@Param('id') id: number): Observable<Employee> {
    return this.employeeService.findEmployeeById(id);
  }

  @Get()
  findAllEmployee(): Observable<Employee[]> {
    return this.employeeService.findAllEmployee();
  }

  @Get('by-userId/:userId')
  findEmployeeByUserId(@Param('userId') userId: number): Observable<Employee> {
    return this.employeeService.findEmployeeByUserId(userId);
  }
  
}
