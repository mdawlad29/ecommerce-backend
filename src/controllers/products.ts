import { Request, Response } from "express";
import { prismaClient } from "..";

export const createProduct = async (req: Request, res: Response) => {
  const { tags = [] } = req.body;

  const formattedTags = Array.isArray(tags) ? tags.join(",") : "";

  const product = await prismaClient.product.create({
    data: { ...req.body, tags: formattedTags },
  });

  res.json(product);
};
