
import React, { useState } from 'react';

const LogForm: React.FC<{ onLogSubmitted: () => void }> = ({ onLogSubmitted }) => {
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<string>('info');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const logData = {
      message,
      severity,
      timestamp: new Date().toISOString(), // Add a timestamp
    };

    try {
      const response = await fetch('http://localhost:4000/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jsonData: logData }),
      });

      if (response.ok) {
        setMessage('');
        setSeverity('info');
        alert('Log submitted successfully!');
        onLogSubmitted();
      } else {
        alert('Failed to submit log.');
      }
    } catch (error) {
      console.error('Error submitting log:', error);
      alert('Error submitting log.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <label>
        Message:
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </label>
      <label>
        Severity:
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
      </label>
      <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Submit Log
      </button>
    </form>
  );
};

export default LogForm;
