import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { prismaClient } from "..";
import { User } from "@prisma/client";

export const authMiddleware = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) => {
  // 1. extract the from header
  const token: any = req.headers.authorization;

  // 2. if token is not present, throw an error of unauthorized
  if (!token) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
  try {
    // 3. if token is present, verify that token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET!) as any;

    // 4. to get the usr fromm the payload
    const user = (await prismaClient.user.findFirst({
      where: { id: payload.userId },
    })) as any;
    
    if (!user) {
      next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }

    // 5. to attach the user to the current request object
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};
