import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchOnce } from "../testing/test-utils";

describe("AgentsPage & AgentsList", () => {
  test("shows loader then empty state when no agents", async () => {
    mockFetchOnce([]); // GET /agents
    // Also dashboard mock in initial render (App uses dashboard for redirects sometimes)
    // Not needed here because route is /agents

    renderWithAppProvider(<App />, { route: "/agents" });

    expect(screen.getByText(/Loading agents/i)).toBeInTheDocument();
    await screen.findByText(/No agents found/i);
    expect(screen.getByText(/Refresh/i)).toBeInTheDocument();
  });

  test("renders agents and refresh triggers reload", async () => {
    // Initial load returns two agents
    mockFetchOnce([
      { id: "a1", name: "Alpha", status: "online", type: "worker", version: "1.0.0" },
      { id: "a2", name: "Beta", status: "offline", type: "worker", version: "1.1.0" },
    ]);

    renderWithAppProvider(<App />, { route: "/agents" });

    await screen.findByText(/Agents \(2\)/i);
    expect(screen.getByText(/Alpha/i)).toBeInTheDocument();
    expect(screen.getByText(/Beta/i)).toBeInTheDocument();

    // Click refresh button and return a different list size
    mockFetchOnce([
      { id: "a1", name: "Alpha", status: "online", type: "worker", version: "1.0.0" },
    ]);

    fireEvent.click(screen.getByRole("button", { name: /Refresh/i }));
    await screen.findByText(/Agents \(1\)/i);
  });
});
