import { Router } from "express";
import {
  getLogsController,
  createLogController,
} from "../controllers/log.controller";

const router = Router();

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Retrieve a list of logs
 *     description: Retrieve a list of logs with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of logs to retrieve per page.
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *         description: Filter logs by severity.
 *     responses:
 *       200:
 *         description: A list of logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       json:
 *                         type: object
 *                       inserted_at:
 *                         type: string
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalLogs:
 *                   type: integer
 *       500:
 *         description: Internal server error.
 */
router.get("/", getLogsController);

/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Create a new log
 *     description: Create a new log entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jsonData:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   severity:
 *                     type: string
 *     responses:
 *       201:
 *         description: The created log.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 json:
 *                   type: object
 *                 inserted_at:
 *                   type: string
 *       400:
 *         description: Bad request. jsonData is required.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createLogController);

export default router;