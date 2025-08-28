import React, { useState } from "react";
import { DefaultService } from "../api/generated";
type LogCreateRequest = Parameters<typeof DefaultService.postLogs>[0];

const LogForm: React.FC<{ onLogSubmitted: () => void }> = ({
  onLogSubmitted,
}) => {
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<string>("info");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const logData: LogCreateRequest = {
      jsonData: {
        message,
        severity,
      },
    };

    try {
      await DefaultService.postLogs(logData);

      setMessage("");
      setSeverity("info");
      // alert("Log submitted successfully!");
      onLogSubmitted();
    } catch (error) {
      console.error("Error submitting log:", error);
      alert("Error submitting log.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2.5 my-2.5 mx-auto p-2.5 border border-gray-300 rounded-lg"
    >
      <label>
        Message:
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="textarea w-full p-2 border border-gray-300 rounded"
        />
      </label>
      <label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="select"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
      </label>
      <button type="submit">Submit Log</button>
    </form>
  );
};

export default LogForm;
