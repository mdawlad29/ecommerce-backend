import express, { Express, Request, Response } from "express";
import { PORT } from "./secret";
import rootRoutes from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middleware/errors";

const app: Express = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: 200, message: "Hello from the application.", data: [] });
});

app.use("/api", rootRoutes);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
