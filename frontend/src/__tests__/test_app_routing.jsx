import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchOnce } from "./test-utils";

describe("App routing and sidebar navigation", () => {
  beforeEach(() => {
    // Default fetch mocks for initial pages rendered during tests
    // Dashboard page fetch
    mockFetchOnce({ totals: {}, health: {}, throughput: {}, alerts: [] }); // GET /dashboard
  });

  test("renders sidebar brand and navigates to Dashboard by default", async () => {
    renderWithAppProvider(<App />, { route: "/" });
    expect(screen.getByText(/Covasant Control Tower/i)).toBeInTheDocument();
    // Dashboard loader then summary
    expect(screen.getByText(/Preparing dashboard/i)).toBeInTheDocument();
    await screen.findByText(/Totals/i);
  });

  test("sidebar links navigate to sections", async () => {
    renderWithAppProvider(<App />, { route: "/dashboard" });
    // Click Agents
    // Agents page needs /agents fetch
    mockFetchOnce([]); // GET /agents
    fireEvent.click(screen.getByText(/Agents/i));
    await screen.findByText(/Agents/);

    // Navigate to Settings
    fireEvent.click(screen.getByText(/Settings/i));
    await screen.findByText(/Settings/);

    // Navigate to Logs (uses hardcoded example route)
    fireEvent.click(screen.getByText(/Logs/i));
    await screen.findByText(/Logs - example/i);
  });

  test("theme toggle switches label text", async () => {
    renderWithAppProvider(<App />, { route: "/dashboard" });
    const toggle = screen.getByRole("button", { name: /toggle theme/i });
    // Initial label shows Dark mode suggestion when light theme
    expect(toggle).toHaveTextContent(/Dark mode/i);
    fireEvent.click(toggle);
    expect(toggle).toHaveTextContent(/Light mode/i);
  });
});
