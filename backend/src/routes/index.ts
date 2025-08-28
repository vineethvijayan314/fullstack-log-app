import { Router, Request, Response } from "express";
import logRoutes from "./log.routes";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running!");
});

router.use("/logs", logRoutes);

export default router;
