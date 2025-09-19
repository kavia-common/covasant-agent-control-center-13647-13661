import React from "react";
import { Container, Card } from "../components/Layout";
import { useApp } from "../context/AppContext";

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /**
   * Minimal settings placeholder for theme and API info (no env changes).
   */
  const { theme } = useApp();
  const apiBase = process.env.REACT_APP_API_BASE_URL || "(not configured)";
  const apiTimeout = process.env.REACT_APP_API_TIMEOUT_MS || "10000";

  return (
    <Container>
      <Card title="Settings" subtitle="Read-only configuration overview">
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Theme</div>
            <div style={{ fontWeight: 600 }}>{theme}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>API Base URL</div>
            <div style={{ fontWeight: 600, wordBreak: "break-all" }}>{apiBase}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>API Timeout (ms)</div>
            <div style={{ fontWeight: 600 }}>{apiTimeout}</div>
          </div>
        </div>
      </Card>
    </Container>
  );
}
