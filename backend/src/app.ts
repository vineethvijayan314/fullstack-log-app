import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());

// Routes
app.use("/", routes);

export default app;
