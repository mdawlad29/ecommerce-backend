import { Router } from "express";
import { errorHandler } from "../error-handler";
import { createProduct } from "../controllers/products";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";

const productsRoutes=Router()

productsRoutes.post("/",[authMiddleware],adminMiddleware,errorHandler(createProduct))

export default productsRoutes