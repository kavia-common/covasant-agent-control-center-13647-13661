import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "./components/Layout";
import AgentsPage from "./pages/AgentsPage";
import AgentDetailsPage from "./pages/AgentDetailsPage";
import LogsPage from "./pages/LogsPage";
import DashboardPage from "./pages/DashboardPage";

// PUBLIC_INTERFACE
function App() {
  /** Main application wiring routes and providers. */
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/agents" replace />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/:agentId" element={<AgentDetailsPage />} />
          <Route path="/agents/:agentId/logs" element={<LogsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/agents" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
