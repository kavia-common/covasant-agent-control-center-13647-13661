import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge, Button, Card, Container, Loader } from "../components/Layout";
import "../components/agentDetail.css";
import { useApp } from "../context/AppContext";

// PUBLIC_INTERFACE
export default function LogsPage() {
  /**
   * Paginated/log viewer for a specific agent, with filters.
   */
  const { agentId } = useParams();
  const { api } = useApp();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [level, setLevel] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");

  const load = async (reset = false) => {
    setLoading(true);
    const res = await api.getAgentLogs(agentId, {
      limit: 50,
      level: level || undefined,
      since: since || undefined,
      until: until || undefined,
      cursor: reset ? undefined : cursor || undefined,
    });
    if (!res.error) {
      const nextCursor = res.data?.nextCursor || null;
      const newLogs = res.data?.logs || [];
      setCursor(nextCursor);
      setLogs((prev) => (reset ? newLogs : [...prev, ...newLogs]));
    }
    setLoading(false);
  };

  useEffect(() => {
    load(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  const applyFilters = () => load(true);

  return (
    <Container>
      <Card title={`Logs - ${agentId}`} right={<Link className="btn btn-secondary" to={`/agents/${encodeURIComponent(agentId)}`}>Back to Agent</Link>}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Any</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>Since (ISO)</label>
            <input placeholder="2025-01-01T00:00:00Z" value={since} onChange={(e) => setSince(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>Until (ISO)</label>
            <input placeholder="2025-01-01T23:59:59Z" value={until} onChange={(e) => setUntil(e.target.value)} />
          </div>
          <Button onClick={applyFilters}>Apply</Button>
          <Button variant="secondary" onClick={() => { setLevel(""); setSince(""); setUntil(""); load(true); }}>Reset</Button>
        </div>
      </Card>

      <Card title="Log Stream">
        {loading && logs.length === 0 ? (
          <Loader text="Loading logs..." />
        ) : logs.length === 0 ? (
          <div>No logs found.</div>
        ) : (
          <div className="logs">
            <ul>
              {logs.map((l, i) => (
                <li key={i}>
                  <span className={`log-level log-${(l.level || "info").toLowerCase()}`}>
                    {l.level || "INFO"}
                  </span>
                  <span className="log-time">{l.timestamp || ""}</span>
                  <span className="log-msg">{l.message || ""}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              {cursor ? (
                <Button variant="secondary" onClick={() => load(false)}>Load more</Button>
              ) : (
                <Badge color="default">No more results</Badge>
              )}
            </div>
          </div>
        )}
      </Card>
    </Container>
  );
}
