import { Request, Response, RequestHandler } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";

export const signup: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  const user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    res.status(400).json({ error: "User already exists" });
    return;
  }

  const newUser = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });
  res.status(201).json({ user: newUser });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    res.status(400).json({ error: "User doesn't exists" });
    return;
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
