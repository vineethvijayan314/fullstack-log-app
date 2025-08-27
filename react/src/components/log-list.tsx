import React, { useEffect, useState } from 'react';

interface LogEntry {
  id: number;
  json: {
    message: string;
    severity: string;
    timestamp: string;
  };
  inserted_at: string;
}

const LogList: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/logs');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LogEntry[] = await response.json();
      setLogs(data);
      setFilteredLogs(data); // Initialize filtered logs with all logs
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (selectedSeverity === 'all') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => log.json.severity === selectedSeverity));
    }
  }, [selectedSeverity, logs]);

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Log Entries</h2>
      <div style={{ marginBottom: '15px', textAlign: 'center' }}>
        <label htmlFor="severity-filter" style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Severity:</label>
        <select
          id="severity-filter"
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="all">All</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
      </div>
      {filteredLogs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No logs found for the selected severity.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredLogs.map((log) => (
            <li key={log.id} style={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginBottom: '10px',
              padding: '15px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <p><strong>Message:</strong> {log.json.message}</p>
              <p><strong>Severity:</strong> <span style={{
                fontWeight: 'bold',
                color: log.json.severity === 'error' ? 'red' :
                       log.json.severity === 'warn' ? 'orange' :
                       log.json.severity === 'info' ? 'blue' : 'gray'
              }}>{log.json.severity}</span></p>
              <p><strong>Timestamp:</strong> {new Date(log.json.timestamp).toLocaleString()}</p>
              <p style={{ fontSize: '0.8em', color: '#888' }}><em>Inserted At: {new Date(log.inserted_at).toLocaleString()}</em></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LogList;
