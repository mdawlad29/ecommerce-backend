import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./products";
import usersRoutes from "./users";

const rootRoutes = Router();

rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/products", productsRoutes);
rootRoutes.use("/users", usersRoutes);

export default rootRoutes;
