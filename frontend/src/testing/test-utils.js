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

/**
 * Internal: deep compare with support for primitives and plain objects.
 * Only used for validating request payload expectations.
 */
const deepEqual = (a, b) => {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
};

/**
 * Internal queue of expected fetch calls.
 * Each item: { matcher, response, callSite, validate, times }
 */
let fetchQueue = [];

/**
 * Creates a Response-like object used by our mocks.
 */
const createMockResponse = (data, { status = 200, headers = { "Content-Type": "application/json" } } = {}) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers,
    json: async () => data,
  };
};

/**
 * PUBLIC_INTERFACE
 * mockFetchOnce: legacy helper to push a response without URL validation.
 * Prefer mockFetchQueue for deterministic test flows.
 */
export const mockFetchOnce = (
  data,
  { status = 200, headers = { "Content-Type": "application/json" } } = {}
) => {
  // Keep compatibility by also enqueuing into the queue with a permissive matcher.
  enqueueFetchMock({
    match: () => true,
    response: createMockResponse(data, { status, headers }),
  });
};

/**
 * PUBLIC_INTERFACE
 * mockFetchOnceError: legacy helper to push an error response without URL validation.
 */
export const mockFetchOnceError = (message = "Request failed", { status = 500 } = {}) => {
  enqueueFetchMock({
    match: () => true,
    response: createMockResponse({ message }, { status }),
  });
};

/**
 * PUBLIC_INTERFACE
 * mockFetchQueue: Enqueue a sequence of expected fetch calls.
 * Each entry may specify:
 * - url: string | RegExp | (urlString) => boolean
 * - method: string (GET/POST/PUT/DELETE...), optional
 * - body: object|string expected request body; if object and request has JSON, compares parsed JSON.
 * - respondWith: { data, status?, headers? } OR a function ({ url, options, index }) => ResponseLike
 * - description: optional string to improve error messages
 *
 * Example:
 * mockFetchQueue([
 *   { url: /\/agents$/, respondWith: { data: [] } },
 *   { url: (u) => u.includes("/dashboard"), respondWith: { data: { totals: {} } } },
 * ]);
 */
export const mockFetchQueue = (entries) => {
  if (!Array.isArray(entries)) throw new Error("mockFetchQueue expects an array of entries");
  for (const entry of entries) {
    const { url, method, body, respondWith, description } = entry || {};
    const matcher = (reqUrl, reqOptions = {}) => {
      // URL match
      if (url !== undefined) {
        if (typeof url === "string") {
          if (reqUrl !== url) return false;
        } else if (url instanceof RegExp) {
          if (!url.test(reqUrl)) return false;
        } else if (typeof url === "function") {
          if (!url(reqUrl)) return false;
        } else {
          return false;
        }
      }
      // Method match
      if (method && (reqOptions.method || "GET").toUpperCase() !== method.toUpperCase()) {
        return false;
      }
      // Body match (best effort JSON compare if both sides are objects)
      if (body !== undefined) {
        let reqBody = reqOptions.body;
        let parsedReqBody = null;
        try {
          parsedReqBody = typeof reqBody === "string" ? JSON.parse(reqBody) : reqBody;
        } catch {
          parsedReqBody = reqBody;
        }
        const expected = body;
        const bothObjects =
          expected && typeof expected === "object" && parsedReqBody && typeof parsedReqBody === "object";
        if (bothObjects) {
          if (!deepEqual(parsedReqBody, expected)) return false;
        } else {
          if (!deepEqual(reqBody, expected)) return false;
        }
      }
      return true;
    };

    const responder = (reqUrl, reqOptions, index) => {
      if (typeof respondWith === "function") {
        return respondWith({ url: reqUrl, options: reqOptions, index });
      }
      // assume object with data/status/headers
      const { data, status = 200, headers = { "Content-Type": "application/json" } } = respondWith || {
        data: null,
      };
      return createMockResponse(data, { status, headers });
    };

    enqueueFetchMock({
      match: matcher,
      responseFactory: responder,
      description: description || (typeof url === "string" ? url : undefined),
    });
  }
};

/**
 * Internal helper to push an expectation.
 */
function enqueueFetchMock({ match, response, responseFactory, description }) {
  const callSite = new Error().stack?.toString();
  fetchQueue.push({
    match,
    response,
    responseFactory,
    callSite,
    description,
  });
}

/**
 * PUBLIC_INTERFACE
 * clearMockFetchQueue: Clears all queued expectations without warning.
 */
export const clearMockFetchQueue = () => {
  fetchQueue = [];
};

/**
 * PUBLIC_INTERFACE
 * resetMockFetchQueue: Clears queue and resets fetch mock implementation hook.
 * You should call this in afterEach if you override fetch implementation.
 */
export const resetMockFetchQueue = () => {
  clearMockFetchQueue();
};

/**
 * PUBLIC_INTERFACE
 * getMockFetchQueueSnapshot: Returns a shallow copy of the pending queue entries
 * for debugging or assertions in tests.
 */
export const getMockFetchQueueSnapshot = () => {
  return [...fetchQueue];
};

/**
 * PUBLIC_INTERFACE
 * assertNoPendingFetchMocks: Throws if expectations remain unconsumed.
 */
export const assertNoPendingFetchMocks = () => {
  if (fetchQueue.length > 0) {
    const remaining = fetchQueue
      .map((e, i) => `#${i + 1} ${e.description || "<no description>"}\n${(e.callSite || "").split("\n")[1] || ""}`)
      .join("\n\n");
    throw new Error(
      `There are unconsumed fetch mocks in the queue (${fetchQueue.length}). Pending expectations:\n${remaining}`
    );
  }
};

/**
 * Hook our global.fetch mock to consume from the queue.
 * We keep this module self-contained: tests just need to import any helper to ensure the side-effect is loaded.
 */
if (typeof global !== "undefined") {
  if (!global.fetch || !global.fetch._isQueueAware) {
    const originalFetch = global.fetch || (() => Promise.reject(new Error("global.fetch not set")));
    const queueAware = async (reqUrl, options = {}) => {
      if (!fetchQueue.length) {
        const msg =
          `Unmocked fetch request: ${reqUrl} ${options?.method ? "(" + options.method + ")" : ""}\n` +
          "No expectations left in the queue. Use mockFetchQueue([...]) or mockFetchOnce(...) to seed responses.\n";
        throw new Error(msg);
      }
      const next = fetchQueue.shift();
      const matches = next.match ? next.match(String(reqUrl), options || {}) : true;
      if (!matches) {
        // Build a helpful error message and keep the queue state unchanged for visibility
        const expectedDesc = next.description ? `Expected: ${next.description}\n` : "";
        const expectedWhere = next.callSite ? `${next.callSite.split("\n")[1] || ""}\n` : "";
        const method = (options?.method || "GET").toUpperCase();
        throw new Error(
          `Fetch call order or matcher mismatch.\n${expectedDesc}${expectedWhere}Got: ${method} ${reqUrl}\n` +
          "Tip: ensure your mocks are enqueued in the correct order, or use url/method/body matchers."
        );
      }
      // Produce response
      if (next.responseFactory) {
        const out = next.responseFactory(String(reqUrl), options || {}, 0);
        return out;
      }
      return next.response || createMockResponse(null);
    };
    queueAware._isQueueAware = true;
    global.fetch = jest.fn(queueAware);
  }
}
