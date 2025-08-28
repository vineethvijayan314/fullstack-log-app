import { Router } from "express";
import {
  getLogsController,
  createLogController,
} from "../controllers/log.controller";

const router = Router();

router.get("/", getLogsController);
router.post("/", createLogController);

export default router;
