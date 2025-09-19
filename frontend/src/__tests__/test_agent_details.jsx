import React from "react";
import { act, fireEvent, screen } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchQueue } from "../testing/test-utils";

describe("AgentDetailsPage & AgentDetail", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const route = "/agents/agent-123";
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost";

  const primeAgentDetailMocks = () => {
    mockFetchQueue([
      {
        url: `${API_BASE}/agents/agent-123`,
        method: "GET",
        description: "GET /agents/:id",
        respondWith: { data: { id: "agent-123", name: "Agent 123", status: "online", type: "worker", version: "2.0.0" } },
      },
      {
        url: `${API_BASE}/agents/agent-123/status`,
        method: "GET",
        description: "GET /agents/:id/status",
        respondWith: { data: { state: "running", host: "host-1", uptime: "1h" } },
      },
      {
        url: new RegExp(`${API_BASE.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}/agents/agent-123/logs\\?limit=20`),
        method: "GET",
        description: "GET /agents/:id/logs initial",
        respondWith: { data: { logs: [{ level: "INFO", message: "Started", timestamp: "t1" }] } },
      },
    ]);
  };

  test("renders details, status badge, and logs", async () => {
    primeAgentDetailMocks();
    renderWithAppProvider(<App />, { route });

    const header = await screen.findByRole("heading", { level: 3, name: /Agent 123/i });
    expect(header).toBeInTheDocument();
    expect(screen.getByText(/running/i)).toBeInTheDocument();
    expect(screen.getByText(/Started/i)).toBeInTheDocument();
    expect(screen.queryByText(/Agent not found/i)).not.toBeInTheDocument();
  });

  test("command buttons call send command and refresh data", async () => {
    primeAgentDetailMocks();
    renderWithAppProvider(<App />, { route });

    await screen.findByRole("heading", { level: 3, name: /Agent 123/i });

    mockFetchQueue([
      {
        url: `${API_BASE}/agents/agent-123/commands`,
        method: "POST",
        description: "POST /agents/:id/commands",
        respondWith: { data: {} },
      },
      {
        url: `${API_BASE}/agents/agent-123`,
        method: "GET",
        description: "Refresh GET /agents/:id",
        respondWith: { data: { id: "agent-123", name: "Agent 123", status: "online", type: "worker", version: "2.0.0" } },
      },
      {
        url: `${API_BASE}/agents/agent-123/status`,
        method: "GET",
        description: "Refresh GET /agents/:id/status",
        respondWith: { data: { state: "running", host: "host-1", uptime: "1h" } },
      },
      {
        url: new RegExp(`${API_BASE.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}/agents/agent-123/logs\\?limit=20`),
        method: "GET",
        description: "Refresh GET /agents/:id/logs",
        respondWith: { data: { logs: [{ level: "INFO", message: "Restarted", timestamp: "t2" }] } },
      },
    ]);

    fireEvent.click(screen.getByRole("button", { name: /^Start$/i }));
    await screen.findByText(/Restarted/i);
  });

  test("logs refresh button reloads logs", async () => {
    primeAgentDetailMocks();
    renderWithAppProvider(<App />, { route });

    await screen.findByRole("heading", { level: 3, name: /Agent 123/i });

    mockFetchQueue([
      {
        url: new RegExp(`${API_BASE.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}/agents/agent-123/logs\\?limit=20`),
        method: "GET",
        description: "Manual refresh logs",
        respondWith: { data: { logs: [{ level: "ERROR", message: "Boom", timestamp: "t3" }] } },
      },
    ]);
    fireEvent.click(screen.getByRole("button", { name: /^Refresh$/i }));
    await screen.findByText(/Boom/i);
  });

  test("status polling interval does not crash during tests", async () => {
    primeAgentDetailMocks();
    renderWithAppProvider(<App />, { route });

    await screen.findByRole("heading", { level: 3, name: /Agent 123/i });

    mockFetchQueue([
      {
        url: `${API_BASE}/agents/agent-123/status`,
        method: "GET",
        description: "Status poll",
        respondWith: { data: { state: "running", host: "host-1", uptime: "2h" } },
      },
    ]);

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByText(/running/i)).toBeInTheDocument();
  });
});
