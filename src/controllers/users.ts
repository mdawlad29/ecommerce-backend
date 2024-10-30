import { Request, Response } from "express";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { AddressSchema } from "../schema/users";
import { prismaClient } from "..";
import { User } from "@prisma/client";

export const address = async (
  req: Request & { user?: User },
  res: Response
) => {
  AddressSchema.parse(req.body);
  let user = req.user;

  try {
    user = await prismaClient.user.findFirstOrThrow({
      where: { id: req.user?.id },
    });
  } catch (error) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: user.id,
    },
  });
  res.status(201).json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {};

export const listAddress = async (req: Request, res: Response) => {};
