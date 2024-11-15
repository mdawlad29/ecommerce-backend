import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";
import { address, deleteAddress, listAddress } from "../controllers/users";

const usersRoutes = Router();

usersRoutes.post("/address", [authMiddleware], errorHandler(address));
usersRoutes.get("/address", [authMiddleware], errorHandler(listAddress));
usersRoutes.delete(
  "/address/:id",
  [authMiddleware],
  errorHandler(deleteAddress)
);
usersRoutes.put("", [authMiddleware], errorHandler(deleteAddress));

export default usersRoutes;
