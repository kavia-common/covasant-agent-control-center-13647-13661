//
// API integration stubs for Covasant Agent Control Tower
// Uses environment variables for configuration. Do not hardcode URLs.
//
// PUBLIC_INTERFACE
export const createApiClient = () => {
  /**
   * This factory returns an API client for interacting with Covasant Agent REST endpoints.
   * It uses the following environment variables:
   * - REACT_APP_API_BASE_URL: Base URL for the backend API (required)
   * - REACT_APP_API_TIMEOUT_MS: Request timeout in ms (optional, defaults to 10000)
   *
   * All functions return { data, error } where:
   * - data: parsed JSON on success
   * - error: { message, status, details } on error
   */
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const timeoutMs = parseInt(process.env.REACT_APP_API_TIMEOUT_MS || "10000", 10);

  if (!baseUrl) {
    // Surface a clear configuration problem for easier debugging
    // Consumers should handle this error in UI gracefully.
    console.warn(
      "Missing REACT_APP_API_BASE_URL. API calls will fail until configured."
    );
  }

  // Simple timeout wrapper for fetch
  const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const resp = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return resp;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  };

  const handleResp = async (resp) => {
    let payload = null;
    try {
      // Try to parse JSON, but allow empty responses
      payload = await resp.json().catch(() => null);
    } catch {
      payload = null;
    }

    if (!resp.ok) {
      return {
        data: null,
        error: {
          message: payload?.message || `Request failed with status ${resp.status}`,
          status: resp.status,
          details: payload,
        },
      };
    }
    return { data: payload, error: null };
  };

  // PUBLIC_INTERFACE
  const getAgents = async () => {
    /**
     * Fetch the list of agents with basic metadata.
     * Returns: { data: AgentSummary[], error }
     */
    try {
      const resp = await fetchWithTimeout(`${baseUrl}/agents`);
      return await handleResp(resp);
    } catch (e) {
      return { data: null, error: { message: e.message || "Network error" } };
    }
  };

  // PUBLIC_INTERFACE
  const getAgentById = async (agentId) => {
    /**
     * Fetch detailed information for an agent by ID.
     * Returns: { data: AgentDetail, error }
     */
    try {
      const resp = await fetchWithTimeout(`${baseUrl}/agents/${encodeURIComponent(agentId)}`);
      return await handleResp(resp);
    } catch (e) {
      return { data: null, error: { message: e.message || "Network error" } };
    }
  };

  // PUBLIC_INTERFACE
  const getAgentStatus = async (agentId) => {
    /**
     * Fetch current status/metrics for an agent by ID.
     * Returns: { data: AgentStatus, error }
     */
    try {
      const resp = await fetchWithTimeout(`${baseUrl}/agents/${encodeURIComponent(agentId)}/status`);
      return await handleResp(resp);
    } catch (e) {
      return { data: null, error: { message: e.message || "Network error" } };
    }
  };

  // PUBLIC_INTERFACE
  const sendAgentCommand = async (agentId, command, payload = {}) => {
    /**
     * Send a control command to an agent.
     * Params:
     * - command: string (e.g., "start", "stop", "restart", "pause", "resume")
     * - payload: optional object with command parameters
     * Returns: { data, error }
     */
    try {
      const resp = await fetchWithTimeout(`${baseUrl}/agents/${encodeURIComponent(agentId)}/commands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, payload }),
      });
      return await handleResp(resp);
    } catch (e) {
      return { data: null, error: { message: e.message || "Network error" } };
    }
  };

  // PUBLIC_INTERFACE
  const getAgentLogs = async (agentId, params = {}) => {
    /**
     * Fetch activity logs for an agent.
     * Params support: { limit, level, since, until, cursor }
     * Returns: { data: { logs: LogEntry[], nextCursor?: string }, error }
     */
    try {
      const qs = new URLSearchParams();
      Object.entries(params || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") qs.append(k, v);
      });
      const resp = await fetchWithTimeout(
        `${baseUrl}/agents/${encodeURIComponent(agentId)}/logs${qs.toString() ? `?${qs}` : ""}`
      );
      return await handleResp(resp);
    } catch (e) {
      return { data: null, error: { message: e.message || "Network error" } };
    }
  };

  // PUBLIC_INTERFACE
  const getOverallDashboard = async () => {
    /**
     * Fetch aggregate metrics across all agents for a dashboard view.
     * Returns: { data: { totals, health, throughput, alerts }, error }
     */
    try {
      const resp = await fetchWithTimeout(`${baseUrl}/dashboard`);
      return await handleResp(resp);
    } catch (e) {
      return { data: null, error: { message: e.message || "Network error" } };
    }
  };

  return {
    getAgents,
    getAgentById,
    getAgentStatus,
    sendAgentCommand,
    getAgentLogs,
    getOverallDashboard,
  };
};

export default createApiClient;
