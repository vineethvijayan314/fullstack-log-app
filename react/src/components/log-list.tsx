import React, { useEffect, useState } from "react";

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
  const [totalLogs, setTotalLogs] = useState<number>(0);

  const handleLogsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLogsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when logs per page changes
  };

  const fetchLogs = async () => {
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
      setTotalLogs(data.totalLogs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger, currentPage, logsPerPage, selectedSeverity]);

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
    <div
      style={{
        margin: "10px",
        padding: "10px",
        border: "1px solid #eee",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Log Entries</h2>
      <div style={{ marginBottom: "15px", textAlign: "center" }}>
        <label
          htmlFor="severity-filter"
          style={{ marginRight: "10px", fontWeight: "bold" }}
        >
          Filter by Severity:
        </label>
        <select
          id="severity-filter"
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid",
          }}
        >
          <option value="all">All</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
      </div>
      <div style={{ marginBottom: "15px", textAlign: "center" }}>
        <label
          htmlFor="logs-per-page"
          style={{ marginRight: "10px", fontWeight: "bold" }}
        >
          Logs per page:
        </label>
        <select
          id="logs-per-page"
          value={logsPerPage}
          onChange={handleLogsPerPageChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid",
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      {filteredLogs.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No logs found for the selected severity.
        </p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {filteredLogs.map((log) => (
            <li
              key={log.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                marginBottom: "10px",
                padding: "15px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "",
                }}
              >
                <p style={{ margin: 0 }}> {log.json.message}</p>
                <p style={{ margin: 0 }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        log.json.severity === "error"
                          ? "red"
                          : log.json.severity === "warn"
                          ? "orange"
                          : log.json.severity === "info"
                          ? "blue"
                          : "gray",
                    }}
                  >
                    {log.json.severity}
                  </span>
                </p>
              </div>
              <p
                style={{
                  fontSize: "0.8em",
                  color: "#777",
                  marginTop: "5px",
                  marginBottom: 0,
                  textAlign: "right",
                }}
              >
                <em>{new Date(log.inserted_at).toLocaleString()}</em>
              </p>
            </li>
          ))}
        </ul>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          Previous
        </button>
        <span style={{ alignSelf: "center", fontWeight: "bold" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LogList;
