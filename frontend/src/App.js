import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AppProvider } from "./context/AppContext";
import { SidebarLayout } from "./components/Layout";
import AgentsPage from "./pages/AgentsPage";
import AgentDetailsPage from "./pages/AgentDetailsPage";
import LogsPage from "./pages/LogsPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";

// PUBLIC_INTERFACE
function App() {
  /** Main application wiring routes and providers with sidebar layout. */
  return (
    <AppProvider>
      <BrowserRouter>
        <SidebarLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agents/:agentId" element={<AgentDetailsPage />} />
            <Route path="/agents/:agentId/logs" element={<LogsPage />} />
            <Route path="/logs" element={<Navigate to="/agents" replace />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </SidebarLayout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
