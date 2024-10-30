import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {
  const { tags = [] } = req.body;

  const formattedTags = Array.isArray(tags) ? tags.join(",") : "";

  const product = await prismaClient.product.create({
    data: { ...req.body, tags: formattedTags },
  });

  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;

    if (Array.isArray(product.tags)) {
      product.tags = product.tags.join(",");
    }

    const updatedProduct = await prismaClient.product.update({
      where: { id: +req.params.id },
      data: product,
    });

    res.json(updatedProduct);
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  // Assignment
  try {
  } catch (error) {}
};

export const listProducts = async (req: Request, res: Response) => {
  const count = await prismaClient.product.count();
  const products = await prismaClient.product.findMany({
    skip: req.query.skip ? +req.query.skip : 0,
    take: 5,
    orderBy: { createdAt: "desc" },
  });
  res.json({ count, data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const product = await prismaClient.product.findFirstOrThrow({
      where: { id: id },
    });
    res.json(product);
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};
