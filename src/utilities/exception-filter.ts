import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

export class AllExceptionsFilter implements ExceptionFilter {
    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = exception.getStatus();

        const exceptionMessage = exception.getResponse() as {
            message: string;
        };

        const errorMessages = !Array.isArray(exceptionMessage.message) ? [exceptionMessage.message] : exceptionMessage.message;

        const errorResponses = [];
        for (const message of errorMessages) {
            errorResponses.push(message);
        }
        response.status(statusCode).json({ code: statusCode, errors: errorMessages });
    }
}
