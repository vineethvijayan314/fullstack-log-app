import React, { useEffect, useState, useCallback } from "react";

interface LogEntry {
  id: number;
  json: {
    message: string;
    severity: string;
    timestamp: string;
  };
  inserted_at: string;
}

const LogList: React.FC<{ refreshTrigger: number }> = ({ refreshTrigger }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [logsPerPage, setLogsPerPage] = useState<number>(10); // Default logs per page
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleLogsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLogsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when logs per page changes
  };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:4000/logs?page=${currentPage}&limit=${logsPerPage}&severity=${selectedSeverity}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLogs(data.logs);
      setFilteredLogs(data.logs); // Initialize filtered logs with current page logs
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, logsPerPage, selectedSeverity]);

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger, fetchLogs]);

  // No client-side filtering needed, as filtering is done on the backend
  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs]);

  // Reset current page to 1 when severity changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSeverity]);

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="m-2.5 p-2.5 border border-gray-200 rounded-lg">
      <h2 className="text-center">Log Entries</h2>
      <div className="mb-3.5 text-center">
        <label htmlFor="severity-filter" className="mr-2.5 font-bold">
          Filter by Severity:
        </label>
        <select
          id="severity-filter"
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="all">All</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
      </div>
      <div className="mb-3.5 text-center">
        <label htmlFor="logs-per-page" className="mr-2.5 font-bold">
          Logs per page:
        </label>
        <select
          id="logs-per-page"
          value={logsPerPage}
          onChange={handleLogsPerPageChange}
          className="p-2 rounded border"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      {filteredLogs.length === 0 ? (
        <p className="text-center">No logs found for the selected severity.</p>
      ) : (
        <ul className="list-none p-0">
          {filteredLogs.map((log) => (
            <li
              key={log.id}
              className="border border-gray-300 rounded-md mb-2.5 p-3.5 shadow-md"
            >
              <div className="flex justify-between items-start">
                <p className="m-0"> {log.json.message}</p>
                <p className="m-0">
                  <span
                    className={`font-bold ${
                      log.json.severity === "error"
                        ? "text-red-500"
                        : log.json.severity === "warn"
                        ? "text-orange-500"
                        : log.json.severity === "info"
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {log.json.severity}
                  </span>
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1.5 mb-0 text-right">
                <em>{new Date(log.inserted_at).toLocaleString()}</em>
              </p>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-center gap-2.5 mt-5">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`py-2.5 px-3.5 bg-blue-500 text-white border-none rounded cursor-pointer ${
            currentPage === 1 ? "opacity-50" : ""
          }`}
        >
          Previous
        </button>
        <span className="self-center font-bold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className={`py-2.5 px-3.5 bg-blue-500 text-white border-none rounded cursor-pointer ${
            currentPage === totalPages ? "opacity-50" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LogList;
