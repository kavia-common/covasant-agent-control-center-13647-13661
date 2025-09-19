import React from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { AppProvider } from "../context/AppContext";

// Utility to provide a mocked AppContext by shadowing the provider's api via prop drilling in tests
// We use a wrapper that renders AppProvider first and then re-render children with injected api in context.
//
// Since AppProvider creates api via createApiClient(), our tests should render the real App tree
// and mock fetch at the network boundary. For page/unit tests that mount components using useApp(),
// we can also directly supply a custom provider to override api if needed.

export const renderWithRouter = (ui, { route = "/", router = "memory" } = {}) => {
  if (router === "browser") {
    window.history.pushState({}, "Test page", route);
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  }
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
};

export const renderWithAppProvider = (ui, { route = "/", router = "memory" } = {}) => {
  const wrapped = <AppProvider>{ui}</AppProvider>;
  return renderWithRouter(wrapped, { route, router });
};

// Mock helpers for fetch responses
export const mockFetchOnce = (data, { status = 200, headers = { "Content-Type": "application/json" } } = {}) => {
  global.fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  });
};

export const mockFetchOnceError = (message = "Request failed", { status = 500 } = {}) => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ message }),
  });
};
