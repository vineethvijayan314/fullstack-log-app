import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
); // Allows requests from your frontend
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Backend server is running!");
});

/**
 * GET /logs
 * Retrieves all log entries from the database, ordered by insertion time.
 */
app.get("/logs", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const severity = req.query.severity as string | undefined;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM log";
    let countQuery = "SELECT COUNT(*) FROM log";
    const queryParams: (string | number)[] = [];
    const countParams: (string | number)[] = [];
    let paramIndex = 1;

    if (severity && severity !== "all") {
      query += ` WHERE json->>'severity' = $${paramIndex}`;
      countQuery += ` WHERE json->>'severity' = $${paramIndex}`;
      queryParams.push(severity);
      countParams.push(severity);
      paramIndex++;
    }

    query += ` ORDER BY inserted_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    queryParams.push(limit, offset);

    console.log("Executing query:", query, "with params:", queryParams);
    // console.log(
    //   "Executing count query:",
    //   countQuery,
    //   "with params:",
    //   countParams
    // );

    const logsResult =
      queryParams && queryParams.length > 0
        ? await pool.query(query, queryParams)
        : await pool.query(query);

    const countResult =
      countParams && countParams.length > 0
        ? await pool.query(countQuery, countParams)
        : await pool.query(countQuery);

    const totalLogs = parseInt(countResult.rows[0].count, 10);

    res.status(200).json({
      logs: logsResult.rows,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
      totalLogs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * POST /logs
 * Inserts a new log entry into the database.
 * Expects a body with a 'json' property, e.g., { "json": { "message": "hello" } }
 */
app.post("/logs", async (req: Request, res: Response) => {
  try {
    const { jsonData } = req.body;

    if (!jsonData) {
      return res.status(400).json({ error: "jsonData is required" });
    }

    const { rows } = await pool.query(
      "INSERT INTO log (json) VALUES ($1) RETURNING *",
      [jsonData]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error inserting log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
