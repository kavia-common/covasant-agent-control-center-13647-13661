import React from "react";
import { within, screen } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchQueue } from "../testing/test-utils";

describe("DashboardPage", () => {
  test("shows loader then renders dashboard summary sections", async () => {
    mockFetchQueue([
      {
        url: "/dashboard",
        method: "GET",
        description: "GET /dashboard",
        respondWith: {
          data: {
            totals: { agents: 5, online: 3, offline: 2, errors: 1 },
            health: { healthy: 3, degraded: 1, unhealthy: 1 },
            throughput: { cmdPerMin: 10, eventsPerMin: 25 },
            alerts: [{ level: "warning", message: "One agent is degraded" }],
          },
        },
      },
    ]);

    renderWithAppProvider(<App />, { route: "/dashboard" });

    expect(screen.getByText(/Preparing dashboard/i)).toBeInTheDocument();

    const totalsCard = await screen.findByRole("heading", { level: 3, name: /Totals/i });
    const totalsContainer = totalsCard.closest(".card");
    const totals = within(totalsContainer);
    expect(totals.getByText(/Agents/i).previousSibling).toHaveTextContent("5");
    expect(totals.getByText(/Online/i).previousSibling).toHaveTextContent("3");
    expect(totals.getByText(/Offline/i).previousSibling).toHaveTextContent("2");
    expect(totals.getByText(/Errors \(24h\)/i).previousSibling).toHaveTextContent("1");

    expect(screen.getByRole("heading", { level: 3, name: /Health/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Throughput/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Active Alerts/i })).toBeInTheDocument();
    expect(screen.getByText(/One agent is degraded/i)).toBeInTheDocument();
  });
});
