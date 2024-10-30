import { NextFunction, Request, RequestHandler, Response } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { BadRequestException } from "./exceptions/bad-request";

export const errorHandler = (
  method: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestException(
            "Unprocessable Entity",
            ErrorCode.UNPROCESSABLE_ENTITY
          );
        } else {
          exception = new InternalException(
            "Something went wrong",
            error,
            ErrorCode.INTERNAL_EXCEPTION
          );
        }
      }
      next(exception);
    }
  };
};
