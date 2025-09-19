import React from "react";
import { act, fireEvent, screen } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchOnce } from "../testing/test-utils";

describe("AgentDetailsPage & AgentDetail", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const route = "/agents/agent-123";

  const primeAgentDetailMocks = () => {
    // Initial parallel calls: getAgentById and getAgentStatus
    mockFetchOnce({ id: "agent-123", name: "Agent 123", status: "online", type: "worker", version: "2.0.0" }); // GET /agents/:id
    mockFetchOnce({ state: "running", host: "host-1", uptime: "1h" }); // GET /agents/:id/status
    // Initial logs load
    mockFetchOnce({ logs: [{ level: "INFO", message: "Started", timestamp: "t1" }] }); // GET /agents/:id/logs?limit=20
  };

  test("renders details, status badge, and logs", async () => {
    primeAgentDetailMocks();
    renderWithAppProvider(<App />, { route });

    // detail name
    await screen.findByText(/Agent 123/i);
    // status badge content
    expect(screen.getByText(/running/i)).toBeInTheDocument();
    // logs
    expect(screen.getByText(/Started/i)).toBeInTheDocument();

    // No errors visible
    expect(screen.queryByText(/Agent not found/i)).not.toBeInTheDocument();
  });

  test("command buttons call send command and refresh data", async () => {
    primeAgentDetailMocks();
    renderWithAppProvider(<App />, { route });

    await screen.findByText(/Agent 123/i);

    // Clicking Start triggers POST then subsequent refresh calls: getAgentById, getAgentStatus, getAgentLogs
    mockFetchOnce({}); // POST /commands
    mockFetchOnce({ id: "agent-123", name: "Agent 123", status: "online", type: "worker", version: "2.0.0" }); // GET details refresh
    mockFetchOnce({ state: "running", host: "host-1", uptime: "1h" }); // GET status refresh
    mockFetchOnce({ logs: [{ level: "INFO", message: "Restarted", timestamp: "t2" }] }); // GET logs refresh

    fireEvent.click(screen.getByRole("button", { name: /Start/i }));

    await screen.findByText(/Restarted/i);
  });

  test("logs refresh button reloads logs", async () => {
    primeAgentDetailMocks();
    renderWithAppProvider(<App />, { route });

    await screen.findByText(/Agent 123/i);

    // Click Refresh and return new logs
    mockFetchOnce({ logs: [{ level: "ERROR", message: "Boom", timestamp: "t3" }] });
    fireEvent.click(screen.getByRole("button", { name: /Refresh/i }));
    await screen.findByText(/Boom/i);
  });

  test("status polling interval does not crash during tests", async () => {
    primeAgentDetailMocks();
    renderWithAppProvider(<App />, { route });

    await screen.findByText(/Agent 123/i);

    // Next interval poll call
    mockFetchOnce({ state: "running", host: "host-1", uptime: "2h" });
    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    // Still renders fine after tick
    expect(screen.getByText(/running/i)).toBeInTheDocument();
  });
});
