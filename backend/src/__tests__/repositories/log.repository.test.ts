import * as LogRepository from '../../repositories/log.repository';
import pool from '../../db'; // Import the actual pool

describe('Log Repository', () => {
  let querySpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on the query method of the imported pool object
    querySpy = jest.spyOn(pool, 'query');
  });

  afterEach(() => {
    // Restore the original implementation after each test
    querySpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('getLogs', () => {
    it('should return logs with default parameters', async () => {
      const mockLogs = [
        { id: 1, json: { message: 'Log 1', severity: 'info' }, inserted_at: '2023-01-01T10:00:00Z' },
      ];
      const mockCount = [{ count: '1' }];

      querySpy
        .mockResolvedValueOnce({ rows: mockLogs })
        .mockResolvedValueOnce({ rows: mockCount });

      const result = await LogRepository.getLogs({});

      expect(querySpy).toHaveBeenCalledTimes(2);
      expect(querySpy).toHaveBeenCalledWith(
        'SELECT * FROM log ORDER BY inserted_at DESC LIMIT $1 OFFSET $2',
        [10, 0]
      );
      expect(querySpy).toHaveBeenCalledWith('SELECT COUNT(*) FROM log');
      expect(result).toEqual({
        logs: mockLogs,
        totalPages: 1,
        currentPage: 1,
        totalLogs: 1,
      });
    });

    it('should return logs with specified parameters', async () => {
      const mockLogs = [
        { id: 1, json: { message: 'Log 1', severity: 'error' }, inserted_at: '2023-01-01T10:00:00Z' },
      ];
      const mockCount = [{ count: '1' }];

      querySpy
        .mockResolvedValueOnce({ rows: mockLogs })
        .mockResolvedValueOnce({ rows: mockCount });

      const result = await LogRepository.getLogs({ page: 2, limit: 5, severity: 'error' });

      expect(querySpy).toHaveBeenCalledTimes(2);
      expect(querySpy).toHaveBeenCalledWith(
        "SELECT * FROM log WHERE json->>'severity' = $1 ORDER BY inserted_at DESC LIMIT $2 OFFSET $3",
        ['error', 5, 5]
      );
      expect(querySpy).toHaveBeenCalledWith(
        "SELECT COUNT(*) FROM log WHERE json->>'severity' = $1",
        ['error']
      );
      expect(result).toEqual({
        logs: mockLogs,
        totalPages: 1,
        currentPage: 2,
        totalLogs: 1,
      });
    });

    it('should return empty logs if no logs found', async () => {
      const mockLogs: any[] = [];
      const mockCount = [{ count: '0' }];

      querySpy
        .mockResolvedValueOnce({ rows: mockLogs })
        .mockResolvedValueOnce({ rows: mockCount });

      const result = await LogRepository.getLogs({});

      expect(querySpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        logs: [],
        totalPages: 0,
        currentPage: 1,
        totalLogs: 0,
      });
    });
  });

  describe('createLog', () => {
    it('should create a new log successfully', async () => {
      const newLogData = { message: 'New log entry', severity: 'debug' };
      const createdLog = { id: 2, json: newLogData, inserted_at: '2023-01-02T10:00:00Z' };

      querySpy.mockResolvedValueOnce({ rows: [createdLog] });

      const result = await LogRepository.createLog(newLogData);

      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(querySpy).toHaveBeenCalledWith(
        'INSERT INTO log (json) VALUES ($1) RETURNING *',
        [newLogData]
      );
      expect(result).toEqual(createdLog);
    });
  });
});
