import request from "supertest";
import app from "../app"; // Import the Express app
import * as LogModel from "../models/log.model";

jest.mock("../models/log.model");

const mockedLogModel = LogModel as jest.Mocked<typeof LogModel>;

describe("API Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    it("should return 200 OK with a message", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toEqual(200);
      expect(res.text).toBe("Backend server is running!");
    });
  });

  describe("GET /logs", () => {
    it("should return 200 OK with logs", async () => {
      const logsResult: LogModel.GetLogsResult = {
        logs: [
          {
            id: 1,
            json: { message: "test", severity: "info" },
            inserted_at: "somedate",
          },
        ],
        totalPages: 1,
        currentPage: 1,
        totalLogs: 1,
      };
      mockedLogModel.getLogs.mockResolvedValue(logsResult);

      const res = await request(app).get("/logs?page=1&limit=10");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(logsResult);
      expect(mockedLogModel.getLogs).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        severity: undefined,
      });
    });

    it("should return 500 on error", async () => {
      mockedLogModel.getLogs.mockRejectedValue(new Error("DB Error"));

      const res = await request(app).get("/logs");

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("POST /logs", () => {
    it("should return 201 Created with the new log", async () => {
      const newLogData: LogModel.LogContent = {
        message: "new log",
        severity: "info",
      };
      const createdLog: LogModel.Log = {
        id: 1,
        json: newLogData,
        inserted_at: "somedate",
      };
      mockedLogModel.createLog.mockResolvedValue(createdLog);

      const res = await request(app)
        .post("/logs")
        .send({ jsonData: newLogData });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(createdLog);
      expect(mockedLogModel.createLog).toHaveBeenCalledWith(newLogData);
    });

    it("should return 400 if jsonData is not provided", async () => {
      const res = await request(app).post("/logs").send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "jsonData is required" });
    });

    it("should return 500 on error", async () => {
      mockedLogModel.createLog.mockRejectedValue(new Error("DB Error"));

      const res = await request(app)
        .post("/logs")
        .send({ jsonData: { message: "test", severity: "info" } });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: "Internal Server Error" });
    });
  });
});