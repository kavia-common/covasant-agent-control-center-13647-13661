import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchQueue } from "../testing/test-utils";

describe("AgentsPage & AgentsList", () => {
  test("shows loader then empty state when no agents", async () => {
    mockFetchQueue([
      { url: "/agents", method: "GET", description: "GET /agents", respondWith: { data: [] } },
    ]);

    renderWithAppProvider(<App />, { route: "/agents" });

    expect(screen.getByText(/Loading agents/i)).toBeInTheDocument();
    await screen.findByText(/No agents found/i);
    expect(screen.getByRole("button", { name: /Refresh/i })).toBeInTheDocument();
  });

  test("renders agents and refresh triggers reload", async () => {
    mockFetchQueue([
      {
        url: "/agents",
        method: "GET",
        description: "Initial GET /agents",
        respondWith: {
          data: [
            { id: "a1", name: "Alpha", status: "online", type: "worker", version: "1.0.0" },
            { id: "a2", name: "Beta", status: "offline", type: "worker", version: "1.1.0" },
          ],
        },
      },
    ]);

    renderWithAppProvider(<App />, { route: "/agents" });

    const title = await screen.findByRole("heading", { level: 3, name: /Agents \(2\)/i });
    expect(title).toBeInTheDocument();
    expect(screen.getByText(/Alpha/i)).toBeInTheDocument();
    expect(screen.getByText(/Beta/i)).toBeInTheDocument();

    mockFetchQueue([
      {
        url: "/agents",
        method: "GET",
        description: "Refresh GET /agents",
        respondWith: { data: [{ id: "a1", name: "Alpha", status: "online", type: "worker", version: "1.0.0" }] },
      },
    ]);

    fireEvent.click(screen.getByRole("button", { name: /^Refresh$/i }));
    await screen.findByRole("heading", { level: 3, name: /Agents \(1\)/i });
  });
});
