import { useState } from "react";
import "./App.css";
import LogForm from "./components/log-form";
import LogList from "./components/log-list";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Log Application
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          gap: "10px",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <div style={{ flex: 1 }}>
          <LogForm onLogSubmitted={handleLogSubmitted} />
        </div>
        <div style={{ flex: 1 }}>
          <LogList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </>
  );
}

export default App;
