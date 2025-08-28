import { Request, Response } from "express";
import {
  getLogsController,
  createLogController,
} from "../../controllers/log.controller";
import * as LogModel from "../../models/log.model";

jest.mock("../../models/log.model");

const mockedLogModel = LogModel as jest.Mocked<typeof LogModel>;

describe("Log Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let resJson: jest.Mock;
  let resStatus: jest.Mock;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
    };
    resJson = jest.fn();
    resStatus = jest.fn().mockReturnValue({ json: resJson });
    res = {
      status: resStatus,
      json: resJson,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getLogsController", () => {
    it("should get logs and return 200", async () => {
      const logsResult = {
        logs: [],
        totalPages: 0,
        currentPage: 1,
        totalLogs: 0,
      };
      mockedLogModel.getLogs.mockResolvedValue(logsResult);

      await getLogsController(req as Request, res as Response);

      expect(mockedLogModel.getLogs).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        severity: undefined,
      });
      expect(resStatus).toHaveBeenCalledWith(200);
      expect(resJson).toHaveBeenCalledWith(logsResult);
    });

    it("should handle errors and return 500", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockedLogModel.getLogs.mockRejectedValue(new Error("DB error"));

      await getLogsController(req as Request, res as Response);

      expect(resStatus).toHaveBeenCalledWith(500);
      expect(resJson).toHaveBeenCalledWith({ error: "Internal Server Error" });
      consoleErrorSpy.mockRestore();
    });
  });

  describe("createLogController", () => {
    it("should create a log and return 201", async () => {
      const newLogData: LogModel.LogContent = {
        message: "new",
        severity: "info",
      };
      req.body = { jsonData: newLogData };
      const createdLog: LogModel.Log = {
        id: 1,
        json: newLogData,
        inserted_at: "somedate",
      };
      mockedLogModel.createLog.mockResolvedValue(createdLog);

      await createLogController(req as Request, res as Response);

      expect(mockedLogModel.createLog).toHaveBeenCalledWith(newLogData);
      expect(resStatus).toHaveBeenCalledWith(201);
      expect(resJson).toHaveBeenCalledWith(createdLog);
    });

    it("should return 400 if jsonData is missing", async () => {
      req.body = {};

      await createLogController(req as Request, res as Response);

      expect(mockedLogModel.createLog).not.toHaveBeenCalled();
      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({ error: "jsonData is required" });
    });

    it("should handle errors and return 500", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const newLogData: LogModel.LogContent = {
        message: "new",
        severity: "info",
      };
      req.body = { jsonData: newLogData };
      mockedLogModel.createLog.mockRejectedValue(new Error("DB error"));

      await createLogController(req as Request, res as Response);

      expect(resStatus).toHaveBeenCalledWith(500);
      expect(resJson).toHaveBeenCalledWith({ error: "Internal Server Error" });
      consoleErrorSpy.mockRestore();
    });
  });
});
