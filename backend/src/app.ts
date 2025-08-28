import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './swagger';

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/", routes);

export default app;
