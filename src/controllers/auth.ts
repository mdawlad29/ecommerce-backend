import { Request, Response, RequestHandler,NextFunction } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignupSchema } from "../schema/users";

export const signup: RequestHandler = async (
  req: Request,
  res: Response,
  next:NextFunction
): Promise<void> => {
  try {
    SignupSchema.parse(req.body)
    const { name, email, password } = req.body;
  
    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      next(new BadRequestException("User already exists", ErrorCode.USER_ALREADY_EXISTS))
    }
  
    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });
    res.status(201).json(user);
  } catch (err:any) {
    next(new UnprocessableEntity(err?.issues,'UnprocessableEntity',ErrorCode.UNPROCESSABLE_ENTITY))
  }
};

export const login = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    res.status(400).json({ error: "User doesn't exists" });
  }

  if (!compareSync(password, user!.password)) {
    throw new Error("Incorrect password!");
  }

  const token = jwt.sign(
    {
      userId: user!.id,
    },
    JWT_SECRET!
  );

  res.status(201).json({ user, token: token });
};
