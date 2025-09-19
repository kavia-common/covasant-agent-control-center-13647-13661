import React from "react";
import { screen } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider, mockFetchOnce } from "../testing/test-utils";

describe("SettingsPage", () => {
  test("shows theme and env values", async () => {
    // Visiting settings directly; no fetch needed but App might fetch dashboard for other routes
    renderWithAppProvider(<App />, { route: "/settings" });

    await screen.findByText(/Settings/i);
    expect(screen.getByText(/Theme/i)).toBeInTheDocument();
    // Default theme is light
    expect(screen.getByText(/light/i)).toBeInTheDocument();

    // Env values display (may show default placeholders)
    expect(screen.getByText(/API Base URL/i)).toBeInTheDocument();
    expect(screen.getByText(/API Timeout/i)).toBeInTheDocument();
  });
});
