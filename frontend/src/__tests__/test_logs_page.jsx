import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchOnce } from "./test-utils";

describe("LogsPage", () => {
  const route = "/agents/agent-x/logs";

  test("loads and renders logs, supports load more pagination", async () => {
    // Initial load (reset)
    mockFetchOnce({ logs: [{ level: "INFO", message: "Log1", timestamp: "t1" }], nextCursor: "c2" });
    renderWithAppProvider(<App />, { route });

    await screen.findByText(/Log1/i);
    // Load more
    mockFetchOnce({ logs: [{ level: "INFO", message: "Log2", timestamp: "t2" }], nextCursor: null });
    fireEvent.click(screen.getByRole("button", { name: /Load more/i }));
    await screen.findByText(/Log2/i);

    // Now no more results badge should show
    expect(screen.getByText(/No more results/i)).toBeInTheDocument();
  });

  test("applies filters and resets", async () => {
    // Initial
    mockFetchOnce({ logs: [], nextCursor: null });
    renderWithAppProvider(<App />, { route });

    await screen.findByText(/No logs found/i);

    // Apply filters
    mockFetchOnce({ logs: [{ level: "ERROR", message: "Filtered", timestamp: "t3" }], nextCursor: null });
    fireEvent.change(screen.getByLabelText(/Level/i), { target: { value: "error" } });
    fireEvent.change(screen.getByLabelText(/Since \(ISO\)/i), { target: { value: "2025-01-01T00:00:00Z" } });
    fireEvent.change(screen.getByLabelText(/Until \(ISO\)/i), { target: { value: "2025-01-01T23:59:59Z" } });
    fireEvent.click(screen.getByRole("button", { name: /Apply/i }));
    await screen.findByText(/Filtered/i);

    // Reset
    mockFetchOnce({ logs: [], nextCursor: null });
    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));
    await screen.findByText(/No logs found/i);
  });
});
