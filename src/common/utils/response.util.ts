import { Request, Response } from 'express';

interface CustomResponseOptions {
  data: any;
  statusCode: number;
  req: Request;
  res: Response;
  message?: string;
}

export class CustomResponse {
  private readonly data: any;
  private readonly statusCode: number;
  private readonly req: Request;
  private readonly res: Response;
  private readonly customMessage?: string;

  constructor(options: CustomResponseOptions) {
    this.data = options.data;
    this.statusCode = options.statusCode;
    this.req = options.req;
    this.res = options.res;
    this.customMessage = options.message;

    const responseObj = {
      success: this.statusCode >= 200 && this.statusCode < 300,
      statusCode: this.statusCode,
      message:
        this.customMessage || this.getMessage(this.statusCode, this.req.method),
      data: this.data,
      timestamp: new Date().toISOString(),
      path: this.req.path,
    };

    this.res.status(this.statusCode).json(responseObj);
  }

  private getMessage(statusCode: number, method: string): string {
    const messages: Record<number, string> = {
      200: `${method} request successful`,
      201: 'Resource created successfully',
      400: 'Bad request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Resource not found',
      500: 'Internal server error',
    };

    return messages[statusCode] || 'Request processed';
  }
}

// import { Request, Response } from "express";

// export class CustomResponse {
//   constructor(
//     private readonly data: any,
//     private readonly statusCode: number,
//     private readonly req: Request,
//     private readonly res: Response,
//     private readonly customMessage?: string
//   ) {
//     const responseObj = {
//       success: this.statusCode >= 200 && this.statusCode < 300,
//       statusCode: this.statusCode,
//       message:
//         this.customMessage ||
//         this.getMessage(this.statusCode, this.req.method),
//       data: this.data,
//       timestamp: new Date().toISOString(),
//       path: this.req.path,
//     };

//     this.res.status(this.statusCode).json(responseObj);
//   }

//   private getMessage(statusCode: number, method: string): string {
//     const messages: Record<number, string> = {
//       200: `${method} request successful`,
//       201: "Resource created successfully",
//       400: "Bad request",
//       401: "Unauthorized",
//       403: "Forbidden",
//       404: "Resource not found",
//       500: "Internal server error",
//     };

//     return messages[statusCode] || "Request processed";
//   }
// }
