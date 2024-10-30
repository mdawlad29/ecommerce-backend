import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./products";

const rootRoutes = Router();

rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/products", productsRoutes);

export default rootRoutes;
