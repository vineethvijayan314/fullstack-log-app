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
      <div className="flex justify-around gap-2.5 flex-wrap w-full h-full">
        <div className="flex-1">
          <LogForm onLogSubmitted={handleLogSubmitted} />
        </div>
        <div className="flex-1">
          <LogList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </>
  );
}

export default App;
