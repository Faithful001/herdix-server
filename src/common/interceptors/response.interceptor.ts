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
import { CUSTOM_STATUS_KEY } from '../decorators/custom-status.decorator';

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
    const defaultStatus = context.switchToHttp().getResponse().statusCode;

    const customMessage = this.reflector.getAllAndOverride<string>(
      CUSTOM_MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const customStatus = this.reflector.getAllAndOverride<number>(
      CUSTOM_STATUS_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data: any) => {
        // priority: service > @CustomStatus > controller default
        const effectiveStatus =
          data?.statusCode || customStatus || defaultStatus;

        // priority: service > @CustomMessage > fallback
        const message =
          data?.message ||
          customMessage ||
          this.getMessage(effectiveStatus, request.method);

        let responseData: any = null;

        if (data && typeof data === 'object') {
          if ('data' in data) {
            // If the service explicitly returned { message, data }
            responseData = data.data;
          } else if (!('data' in data) && !('message' in data)) {
            // If it's just a plain object (e.g. entity, DTO, etc.)
            responseData = data;
          } else {
            // If only message was returned, keep data null
            responseData = null;
          }
        } else {
          // primitive (string, number, boolean)
          responseData = data;
        }

        return {
          success: effectiveStatus >= 200 && effectiveStatus < 300,
          statusCode: effectiveStatus,
          message,
          data: responseData,
          timestamp: new Date().toISOString(),
          path: request.path,
        };
      }),
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
