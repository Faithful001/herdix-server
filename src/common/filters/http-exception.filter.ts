import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  error?: string;
  message: string | string[];
  data: T | null;
  timestamp: string;
  path: string;
  stack?: string; // Optional stack trace for development
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: string | undefined = 'InternalServerError';
    let message: string | string[] = 'Internal server error';

    // Handle HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.name;
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        message = (exceptionResponse as any).message || 'An error occurred';
        if (Array.isArray(message)) {
          message = message.join(', ');
        }
      }
    }
    // Handle Mongoose ValidationError
    else if (this.isMongooseValidationError(exception)) {
      status = HttpStatus.BAD_REQUEST;
      error = 'ValidationError';
      message = Object.values(
        (exception as MongooseError.ValidationError).errors,
      )
        .map((err) => err.message)
        .join(', ');
    }
    // Handle Mongoose Duplicate Key Error (code 11000)
    else if (this.isMongooseDuplicateKeyError(exception)) {
      status = HttpStatus.CONFLICT;
      error = 'DuplicateKeyError';
      const keyValue = (exception as any).keyValue;
      const key = Object.keys(keyValue)[0];
      message = `Duplicate value '${keyValue[key]}' for field '${key}'`;
    }
    // Handle generic errors
    else if (exception instanceof Error) {
      error = exception.name;
      message = exception.message;
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${error}: ${message}`,
      exception instanceof Error && !isProduction ? exception.stack : undefined,
    );

    // Build the response
    const errorResponse: ApiResponse<null> = {
      success: false,
      statusCode: status,
      // error,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Include stack trace in non-production environments
    if (!isProduction && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  private isMongooseValidationError(
    exception: unknown,
  ): exception is MongooseError.ValidationError {
    return (exception as any)?.name === 'ValidationError';
  }

  private isMongooseDuplicateKeyError(exception: unknown): boolean {
    return (exception as any)?.code === 11000;
  }
}
