import { Request, Response } from 'express';
import { getLogsController, createLogController } from '../../controllers/log.controller';
import * as LogRepository from '../../repositories/log.repository';

// Explicitly define the mock for LogRepository
jest.mock('../../repositories/log.repository', () => ({
  getLogs: jest.fn(),
  createLog: jest.fn(),
}));

describe('Log Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;

  // Cast LogRepository to its mocked type for easier access
  const mockedLogRepository = LogRepository as jest.Mocked<typeof LogRepository>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    statusSpy = jest.spyOn(mockResponse, 'status');
    jsonSpy = jest.spyOn(mockResponse, 'json');

    // Clear mocks before each test
    mockedLogRepository.getLogs.mockClear();
    mockedLogRepository.createLog.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLogsController', () => {
    it('should return logs with default parameters', async () => {
      const mockLogs = {
        logs: [{ id: 1, json: { message: 'test', severity: 'info' }, inserted_at: '2023-01-01' }],
        totalPages: 1,
        currentPage: 1,
        totalLogs: 1,
      };
      mockedLogRepository.getLogs.mockResolvedValue(mockLogs);

      mockRequest.query = {};

      await getLogsController(mockRequest as Request, mockResponse as Response);

      expect(mockedLogRepository.getLogs).toHaveBeenCalledWith({ page: 1, limit: 10, severity: undefined });
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(mockLogs);
    });

    it('should return logs with specified parameters', async () => {
      const mockLogs = {
        logs: [{ id: 1, json: { message: 'test', severity: 'error' }, inserted_at: '2023-01-01' }],
        totalPages: 1,
        currentPage: 1,
        totalLogs: 1,
      };
      mockedLogRepository.getLogs.mockResolvedValue(mockLogs);

      mockRequest.query = { page: '2', limit: '5', severity: 'error' };

      await getLogsController(mockRequest as Request, mockResponse as Response);

      expect(mockedLogRepository.getLogs).toHaveBeenCalledWith({ page: 2, limit: 5, severity: 'error' });
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(mockLogs);
    });

    it('should handle errors', async () => {
      const errorMessage = 'Database error';
      mockedLogRepository.getLogs.mockRejectedValue(new Error(errorMessage));

      mockRequest.query = {};

      await getLogsController(mockRequest as Request, mockResponse as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('createLogController', () => {
    it('should create a new log successfully', async () => {
      const newLogData = { message: 'New log entry', severity: 'debug' };
      const createdLog = { id: 2, json: newLogData, inserted_at: '2023-01-02' };
      mockedLogRepository.createLog.mockResolvedValue(createdLog);

      mockRequest.body = { jsonData: newLogData };

      await createLogController(mockRequest as Request, mockResponse as Response);

      expect(mockedLogRepository.createLog).toHaveBeenCalledWith(newLogData);
      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith(createdLog);
    });

    it('should return 400 if jsonData is missing', async () => {
      mockRequest.body = {};

      await createLogController(mockRequest as Request, mockResponse as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'jsonData is required' });
      expect(mockedLogRepository.createLog).not.toHaveBeenCalled(); // Ensure createLog was not called
    });

    it('should handle errors', async () => {
      const errorMessage = 'Database error';
      mockedLogRepository.createLog.mockRejectedValue(new Error(errorMessage));

      mockRequest.body = { jsonData: { message: 'test' } };

      await createLogController(mockRequest as Request, mockResponse as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});