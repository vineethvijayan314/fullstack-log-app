import { Request, Response } from "express";
import * as LogRepository from "../repositories/log.repository";

export const getLogsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const severity = req.query.severity as string | undefined;

    const result = await LogRepository.getLogs({ page, limit, severity });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createLogController = async (req: Request, res: Response) => {
  try {
    const { jsonData } = req.body;

    if (!jsonData) {
      return res.status(400).json({ error: "jsonData is required" });
    }

    const newLog = await LogRepository.createLog(jsonData);
    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error inserting log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
