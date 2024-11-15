import { Request, Response } from "express";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { Address, User } from "@prisma/client";
import { BadRequestException } from "../exceptions/bad-request";

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

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({ where: { id: +req.params.id } });

    res.json({ success: true });
  } catch (error) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

export const listAddress = async (
  req: Request & { user?: User },
  res: Response
) => {
  const address = await prismaClient.address.findMany({
    where: { userId: req.user?.id },
  });
  res.json({ address });
};

export const UpdateUser = async (
  req: Request & { user?: User },
  res: Response
) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;

  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: { id: validatedData.defaultShippingAddress },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    if (req.user && shippingAddress.userId !== req.user.id) {
      throw new BadRequestException(
        "Address doesn't belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: { id: validatedData.defaultBillingAddress },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    if (req.user && billingAddress.userId !== req.user.id) {
      throw new BadRequestException(
        "Address doesn't belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: { id: req.user?.id },
    data: { ...validatedData, name: validatedData.name ?? "" },
  });
  res.json(updatedUser);
};
