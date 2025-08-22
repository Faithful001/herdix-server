import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types/api-response.type';
import { CUSTOM_MESSAGE_KEY } from '../decorators/custom-message.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const statusCode = context.switchToHttp().getResponse().statusCode;

    const customMessage = this.reflector.getAllAndOverride<string>(
      CUSTOM_MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode,
        message: customMessage || this.getMessage(statusCode, request.method),
        data,
        timestamp: new Date().toISOString(),
        path: request.path,
      })),
    );
  }

  private getMessage(statusCode: number, method: string): string {
    const messages = {
      GET: { 200: 'Request successful' },
      POST: { 201: 'Resource created successfully', 200: 'Request successful' },
      PUT: { 200: 'Resource updated successfully' },
      DELETE: { 200: 'Resource deleted successfully' },
    };

    return messages[method]?.[statusCode] || 'Request processed successfully';
  }
}
