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
      <h1>Log App based on react and Daisy UI</h1>
      <LogForm onLogSubmitted={handleLogSubmitted} />
      <LogList refreshTrigger={refreshTrigger} />
    </>
  );
}

export default App;
