import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchQueue } from "../testing/test-utils";

describe("App routing and sidebar navigation", () => {
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost";

  beforeEach(() => {
    mockFetchQueue([
      {
        url: `${API_BASE}/dashboard`,
        method: "GET",
        description: "GET /dashboard default",
        respondWith: { data: { totals: {}, health: {}, throughput: {}, alerts: [] } },
      },
    ]);
  });

  test("renders sidebar brand and navigates to Dashboard by default", async () => {
    renderWithAppProvider(<App />, { route: "/" });
    expect(screen.getByRole("link", { name: /Covasant Control Tower/i })).toBeInTheDocument();
    expect(screen.getByText(/Preparing dashboard/i)).toBeInTheDocument();
    await screen.findByRole("heading", { level: 3, name: /Totals/i });
  });

  test("sidebar links navigate to sections", async () => {
    renderWithAppProvider(<App />, { route: "/dashboard" });

    mockFetchQueue([{ url: `${API_BASE}/agents`, method: "GET", description: "GET /agents", respondWith: { data: [] } }]);
    fireEvent.click(screen.getByRole("link", { name: /Agents/i }));
    await screen.findByRole("heading", { level: 3, name: /Agents/i });

    fireEvent.click(screen.getByRole("link", { name: /Settings/i }));
    await screen.findByRole("heading", { level: 3, name: /Settings/i });

    // Navigate to Logs (example logs route in sidebar)
    fireEvent.click(screen.getByRole("link", { name: /Logs/i }));
    await screen.findByText(/Logs - example/i);
  });

  test("theme toggle switches label text", async () => {
    renderWithAppProvider(<App />, { route: "/dashboard" });
    const toggle = screen.getByRole("button", { name: /Toggle theme/i });
    expect(toggle).toHaveTextContent(/Dark mode/i);
    fireEvent.click(toggle);
    expect(toggle).toHaveTextContent(/Light mode/i);
  });
});
