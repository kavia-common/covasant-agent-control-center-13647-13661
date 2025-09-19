import React from "react";
import { screen } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchOnce } from "../testing/test-utils";

describe("DashboardPage", () => {
  test("shows loader then renders dashboard summary sections", async () => {
    mockFetchOnce({
      totals: { agents: 5, online: 3, offline: 2, errors: 1 },
      health: { healthy: 3, degraded: 1, unhealthy: 1 },
      throughput: { cmdPerMin: 10, eventsPerMin: 25 },
      alerts: [{ level: "warning", message: "One agent is degraded" }],
    }); // GET /dashboard

    renderWithAppProvider(<App />, { route: "/dashboard" });

    expect(screen.getByText(/Preparing dashboard/i)).toBeInTheDocument();

    await screen.findByText(/Totals/i);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(/Health/i)).toBeInTheDocument();
    expect(screen.getByText(/Throughput/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Alerts/i)).toBeInTheDocument();
    expect(screen.getByText(/One agent is degraded/i)).toBeInTheDocument();
  });
});
