import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";
import { address, deleteAddress, listAddress } from "../controllers/users";

const usersRoutes = Router();

usersRoutes.post(
  "/address",
  [authMiddleware, adminMiddleware],
  errorHandler(address)
);
usersRoutes.get(
  "/address/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(listAddress)
);
usersRoutes.delete(
  "/address/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteAddress)
);
export default usersRoutes;
