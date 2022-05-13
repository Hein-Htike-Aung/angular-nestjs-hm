import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpExceptionResponse } from '../models/exception-response.interface';
import { Request, Response } from 'express';

// @Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: HttpStatus;
    let message: string;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();

      message =
        (errorResponse as HttpExceptionResponse).message || exception.message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Critical internal server error occurred!';
    }

    const errorResponse = {
      statusCode,
      message,
      path: request.url,
      method: request.method,
      timeStamp: new Date(),
    };

    response.status(statusCode).json(errorResponse);
  }
}
