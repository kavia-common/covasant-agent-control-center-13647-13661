import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchQueue } from "../testing/test-utils";

describe("LogsPage", () => {
  const route = "/agents/agent-x/logs";
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost";

  test("loads and renders logs, supports load more pagination", async () => {
    mockFetchQueue([
      {
        url: new RegExp(`${API_BASE.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}/agents/agent-x/logs\\?limit=50`),
        method: "GET",
        description: "Initial logs",
        respondWith: { data: { logs: [{ level: "INFO", message: "Log1", timestamp: "t1" }], nextCursor: "c2" } },
      },
    ]);

    renderWithAppProvider(<App />, { route });

    await screen.findByText(/Log1/i);

    mockFetchQueue([
      {
        url: new RegExp(`${API_BASE.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}/agents/agent-x/logs\\?limit=50&cursor=c2`),
        method: "GET",
        description: "Load more logs",
        respondWith: { data: { logs: [{ level: "INFO", message: "Log2", timestamp: "t2" }], nextCursor: null } },
      },
    ]);

    fireEvent.click(screen.getByRole("button", { name: /^Load more$/i }));
    await screen.findByText(/Log2/i);
    expect(screen.getByText(/No more results/i)).toBeInTheDocument();
  });

  test("applies filters and resets", async () => {
    mockFetchQueue([
      {
        url: new RegExp(`${API_BASE.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}/agents/agent-x/logs\\?limit=50`),
        method: "GET",
        description: "Initial empty logs",
        respondWith: { data: { logs: [], nextCursor: null } },
      },
    ]);

    renderWithAppProvider(<App />, { route });

    await screen.findByText(/No logs found/i);

    mockFetchQueue([
      {
        url: (u) =>
          u.startsWith(`${API_BASE}/agents/agent-x/logs`) &&
          u.includes("limit=50") &&
          u.includes("level=error") &&
          u.includes("since=2025-01-01T00%3A00%3A00Z") &&
          u.includes("until=2025-01-01T23%3A59%3A59Z"),
        method: "GET",
        description: "Apply filters logs",
        respondWith: { data: { logs: [{ level: "ERROR", message: "Filtered", timestamp: "t3" }], nextCursor: null } },
      },
    ]);

    fireEvent.change(screen.getByLabelText(/Level/i), { target: { value: "error" } });
    fireEvent.change(screen.getByLabelText(/Since \(ISO\)/i), { target: { value: "2025-01-01T00:00:00Z" } });
    fireEvent.change(screen.getByLabelText(/Until \(ISO\)/i), { target: { value: "2025-01-01T23:59:59Z" } });
    fireEvent.click(screen.getByRole("button", { name: /^Apply$/i }));
    await screen.findByText(/Filtered/i);

    mockFetchQueue([
      {
        url: new RegExp(`${API_BASE.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}/agents/agent-x/logs\\?limit=50`),
        method: "GET",
        description: "Reset logs",
        respondWith: { data: { logs: [], nextCursor: null } },
      },
    ]);
    fireEvent.click(screen.getByRole("button", { name: /^Reset$/i }));
    await screen.findByText(/No logs found/i);
  });
});
