import request from "supertest";
import app from "../app"; // Import the Express app
import * as LogRepository from "../repositories/log.repository";

jest.mock("../repositories/log.repository");

const mockedLogRepository = LogRepository as jest.Mocked<typeof LogRepository>;

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
      const logsResult: LogRepository.GetLogsResult = {
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
      mockedLogRepository.getLogs.mockResolvedValue(logsResult);

      const res = await request(app).get("/logs?page=1&limit=10");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(logsResult);
      expect(mockedLogRepository.getLogs).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        severity: undefined,
      });
    });

    it("should return 500 on error", async () => {
      mockedLogRepository.getLogs.mockRejectedValue(new Error("DB Error"));

      const res = await request(app).get("/logs");

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("POST /logs", () => {
    it("should return 201 Created with the new log", async () => {
      const newLogData: LogRepository.LogContent = {
        message: "new log",
        severity: "info",
      };
      const createdLog: LogRepository.Log = {
        id: 1,
        json: newLogData,
        inserted_at: "somedate",
      };
      mockedLogRepository.createLog.mockResolvedValue(createdLog);

      const res = await request(app)
        .post("/logs")
        .send({ jsonData: newLogData });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(createdLog);
      expect(mockedLogRepository.createLog).toHaveBeenCalledWith(newLogData);
    });

    it("should return 400 if jsonData is not provided", async () => {
      const res = await request(app).post("/logs").send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "jsonData is required" });
    });

    it("should return 500 on error", async () => {
      mockedLogRepository.createLog.mockRejectedValue(new Error("DB Error"));

      const res = await request(app)
        .post("/logs")
        .send({ jsonData: { message: "test", severity: "info" } });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: "Internal Server Error" });
    });
  });
});