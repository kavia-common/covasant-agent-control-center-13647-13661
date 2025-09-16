import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Loader } from "./Layout";

// PUBLIC_INTERFACE
export const AgentDetail = ({ agentId, api }) => {
  /**
   * Shows agent details, live status, and quick controls.
   */
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logLoading, setLogLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr(null);
    const [dRes, sRes] = await Promise.all([
      api.getAgentById(agentId),
      api.getAgentStatus(agentId),
    ]);
    if (dRes.error) setErr(dRes.error.message);
    if (sRes.error) setErr((e) => e || sRes.error.message);
    setDetail(dRes.data || null);
    setStatus(sRes.data || null);
    setLoading(false);
  };

  const loadLogs = async () => {
    setLogLoading(true);
    const res = await api.getAgentLogs(agentId, { limit: 20 });
    if (!res.error) setLogs(res.data?.logs || []);
    setLogLoading(false);
  };

  useEffect(() => {
    load();
    loadLogs();
    // Poll status every 10s
    const id = setInterval(() => {
      api.getAgentStatus(agentId).then((r) => !r.error && setStatus(r.data));
    }, 10000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  const sendCmd = async (command) => {
    setSending(true);
    const res = await api.sendAgentCommand(agentId, command);
    setSending(false);
    if (res.error) {
      alert(`Command failed: ${res.error.message}`);
    } else {
      // Refresh status/logs post command
      load();
      loadLogs();
    }
  };

  const statusBadge = useMemo(() => {
    const s = (status?.state || detail?.status || "unknown").toLowerCase();
    let color = "default";
    if (["running", "online", "healthy"].includes(s)) color = "success";
    else if (["degraded", "warning"].includes(s)) color = "warning";
    else if (["stopped", "offline", "error", "failed"].includes(s)) color = "danger";
    return <Badge color={color}>{s}</Badge>;
  }, [status, detail]);

  if (loading) return <Loader text="Loading agent..." />;
  if (err) return <Card title="Agent"><div style={{ color: "tomato" }}>{err}</div></Card>;
  if (!detail) return <Card title="Agent"><div>Agent not found.</div></Card>;

  return (
    <>
      <Card title={detail.name || detail.id} subtitle={detail.description}>
        <div className="detail-grid">
          <div>
            <div className="label">Agent ID</div>
            <div className="value mono">{detail.id}</div>
          </div>
          <div>
            <div className="label">Status</div>
            <div className="value">{statusBadge}</div>
          </div>
          <div>
            <div className="label">Type</div>
            <div className="value">{detail.type || "n/a"}</div>
          </div>
          <div>
            <div className="label">Version</div>
            <div className="value">{detail.version || "n/a"}</div>
          </div>
          <div>
            <div className="label">Host</div>
            <div className="value">{status?.host || detail.host || "n/a"}</div>
          </div>
          <div>
            <div className="label">Uptime</div>
            <div className="value">{status?.uptime || "-"}</div>
          </div>
        </div>
      </Card>

      <Card title="Controls">
        <div className="controls">
          <Button disabled={sending} onClick={() => sendCmd("start")}>Start</Button>
          <Button disabled={sending} onClick={() => sendCmd("stop")}>Stop</Button>
          <Button disabled={sending} onClick={() => sendCmd("restart")}>Restart</Button>
          <Button disabled={sending} onClick={() => sendCmd("pause")}>Pause</Button>
          <Button disabled={sending} onClick={() => sendCmd("resume")}>Resume</Button>
        </div>
      </Card>

      <Card title="Recent Logs" right={<Button variant="secondary" onClick={loadLogs} disabled={logLoading}>Refresh</Button>}>
        <div className="logs">
          {logLoading ? (
            <Loader text="Fetching logs..." />
          ) : logs.length === 0 ? (
            <div>No logs.</div>
          ) : (
            <ul>
              {logs.map((l, idx) => (
                <li key={idx}>
                  <span className={`log-level log-${(l.level || "info").toLowerCase()}`}>
                    {l.level || "INFO"}
                  </span>
                  <span className="log-time">{l.timestamp || ""}</span>
                  <span className="log-msg">{l.message || ""}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </>
  );
};

export default AgentDetail;
