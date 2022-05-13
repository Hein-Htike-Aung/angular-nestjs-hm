import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export class ErrorHandler {
  static duplicationError() {
    return (err: QueryFailedError) => {
      if (err.message.indexOf('duplicate key') != -1)
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      throw Error();
    };
  }

  static entityNotFoundError(id: number, entityName: string) {
    return (err: QueryFailedError) => {
      if (err.message.indexOf('Could not find any entity') != -1) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: `No ${entityName} found with id ${id}`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new Error();
    };
  }

  static forbiddenAction(entityName: string) {
    throw new HttpException(
      {
        status: HttpStatus.NOT_ACCEPTABLE,
        message: `${entityName} cannot be deleted`,
      },
      HttpStatus.NOT_ACCEPTABLE,
    );
  }

  static throwUnAuthorizeException(message?: string) {
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        message: message || `Invalid Credential`,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
