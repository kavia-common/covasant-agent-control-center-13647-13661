import React from "react";
import { screen } from "@testing-library/react";
import App from "../App";
import { renderWithAppProvider } from "../testing/test-utils";

describe("SettingsPage", () => {
  test("shows theme and env values", async () => {
    renderWithAppProvider(<App />, { route: "/settings" });

    await screen.findByRole("heading", { level: 3, name: /Settings/i });
    expect(screen.getByText(/Theme/i)).toBeInTheDocument();
    expect(screen.getByText(/light/i)).toBeInTheDocument();
    expect(screen.getByText(/API Base URL/i)).toBeInTheDocument();
    expect(screen.getByText(/API Timeout/i)).toBeInTheDocument();
  });
});
