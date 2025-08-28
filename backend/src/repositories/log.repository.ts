import pool from "../db";

export interface LogContent {
  message: string;
  severity: string;
  [key: string]: unknown;
}

export interface Log {
  id: number;
  json: LogContent;
  inserted_at: string;
}

export interface GetLogsParams {
  page?: number;
  limit?: number;
  severity?: string;
}

export interface GetLogsResult {
  logs: Log[];
  totalPages: number;
  currentPage: number;
  totalLogs: number;
}

export const getLogs = async ({
  page = 1,
  limit = 10,
  severity,
}: GetLogsParams): Promise<GetLogsResult> => {
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

  const logsResultPromise = pool.query(query, queryParams);

  const countResultPromise =
    countParams.length > 0
      ? pool.query(countQuery, countParams)
      : pool.query(countQuery);

  const [logsResult, countResult] = await Promise.all([
    logsResultPromise,
    countResultPromise,
  ]);

  const totalLogs = parseInt(countResult.rows[0].count, 10);

  return {
    logs: logsResult.rows,
    totalPages: Math.ceil(totalLogs / limit),
    currentPage: page,
    totalLogs,
  };
};

export const createLog = async (jsonData: LogContent): Promise<Log> => {
  const { rows } = await pool.query(
    "INSERT INTO log (json) VALUES ($1) RETURNING *",
    [jsonData]
  );
  return rows[0];
};
