import pool from "../../db";
import { getLogs, createLog } from "../../models/log.model";

jest.mock("../../db", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

const mockedPoolQuery = pool.query as jest.Mock;

describe("Log Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getLogs", () => {
    it("should retrieve logs with pagination", async () => {
      const mockLogs = [{ id: 1, json: { message: "test" } }];
      const mockCount = { count: "1" };
      mockedPoolQuery
        .mockResolvedValueOnce({ rows: mockLogs }) // for logs
        .mockResolvedValueOnce({ rows: [mockCount] }); // for count

      const result = await getLogs({ page: 1, limit: 10 });

      expect(mockedPoolQuery).toHaveBeenCalledTimes(2);
      expect(mockedPoolQuery).toHaveBeenCalledWith(
        "SELECT * FROM log ORDER BY inserted_at DESC LIMIT $1 OFFSET $2",
        [10, 0]
      );
      expect(mockedPoolQuery).toHaveBeenCalledWith("SELECT COUNT(*) FROM log");
      expect(result).toEqual({
        logs: mockLogs,
        totalPages: 1,
        currentPage: 1,
        totalLogs: 1,
      });
    });

    it("should retrieve logs with severity filter", async () => {
      const mockLogs = [
        { id: 1, json: { message: "test", severity: "high" } },
      ];
      const mockCount = { count: "1" };
      mockedPoolQuery
        .mockResolvedValueOnce({ rows: mockLogs }) // for logs
        .mockResolvedValueOnce({ rows: [mockCount] }); // for count

      const result = await getLogs({ page: 1, limit: 10, severity: "high" });

      expect(mockedPoolQuery).toHaveBeenCalledTimes(2);
      expect(mockedPoolQuery).toHaveBeenCalledWith(
        "SELECT * FROM log WHERE json->>'severity' = $1 ORDER BY inserted_at DESC LIMIT $2 OFFSET $3",
        ["high", 10, 0]
      );
      expect(mockedPoolQuery).toHaveBeenCalledWith(
        "SELECT COUNT(*) FROM log WHERE json->>'severity' = $1",
        ["high"]
      );
      expect(result).toEqual({
        logs: mockLogs,
        totalPages: 1,
        currentPage: 1,
        totalLogs: 1,
      });
    });
  });

  describe("createLog", () => {
    it("should create a new log", async () => {
      const newLogData = { message: "new log" };
      const createdLog = {
        id: 1,
        json: newLogData,
        inserted_at: new Date().toISOString(),
      };
      mockedPoolQuery.mockResolvedValue({ rows: [createdLog] });

      const result = await createLog(newLogData as any);

      expect(mockedPoolQuery).toHaveBeenCalledTimes(1);
      expect(mockedPoolQuery).toHaveBeenCalledWith(
        "INSERT INTO log (json) VALUES ($1) RETURNING *",
        [newLogData]
      );
      expect(result).toEqual(createdLog);
    });
  });
});
