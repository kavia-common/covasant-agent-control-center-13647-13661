import React from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { AppProvider } from "../context/AppContext";

/**
 * PUBLIC_INTERFACE
 * renderWithAppProvider: Render a UI wrapped ONLY with AppProvider.
 * Important: Does NOT add any Router. Useful when the component (e.g., <App />) already contains a Router.
 */
export const renderWithAppProvider = (ui) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

/**
 * PUBLIC_INTERFACE
 * renderWithRouterOnly: Render a UI wrapped with a Router but NOT AppProvider.
 * Use this for components that require a Router but are not the full App tree.
 */
export const renderWithRouterOnly = (ui, { route = "/", router = "memory" } = {}) => {
  if (router === "browser") {
    window.history.pushState({}, "Test page", route);
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  }
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

/**
 * PUBLIC_INTERFACE
 * renderWithAppProviderAndRouter: For cases where you need both Provider and Router
 * around a component that itself doesn't include them (NOT for <App />).
 */
export const renderWithAppProviderAndRouter = (ui, { route = "/", router = "memory" } = {}) => {
  const wrapped = <AppProvider>{ui}</AppProvider>;
  return renderWithRouterOnly(wrapped, { route, router });
};

// PUBLIC_INTERFACE
export const mockFetchOnce = (
  data,
  { status = 200, headers = { "Content-Type": "application/json" } } = {}
) => {
  global.fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    headers,
    json: async () => data,
  });
};

// PUBLIC_INTERFACE
export const mockFetchOnceError = (message = "Request failed", { status = 500 } = {}) => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ message }),
  });
};
