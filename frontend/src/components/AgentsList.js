import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, EmptyState } from "./Layout";

const statusToBadge = (status) => {
  switch ((status || "").toLowerCase()) {
    case "running":
    case "healthy":
    case "online":
      return "success";
    case "degraded":
    case "warning":
      return "warning";
    case "stopped":
    case "offline":
    case "error":
      return "danger";
    default:
      return "default";
  }
};

// PUBLIC_INTERFACE
export const AgentsList = ({ agents, onRefresh }) => {
  /**
   * Renders list of agents with quick status and link to details.
   */
  if (!agents || agents.length === 0) {
    return (
      <Card title="Agents">
        <EmptyState
          title="No agents found"
          description="Once agents register, they will appear here."
          action={
            <Button onClick={onRefresh} className="mt-2">
              Refresh
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card
      title={`Agents (${agents.length})`}
      right={<Button variant="secondary" onClick={onRefresh}>Refresh</Button>}
    >
      <div className="agents-grid">
        {agents.map((a) => (
          <div key={a.id} className="agent-item">
            <div className="agent-top">
              <div className="agent-title">
                <h4 className="m-0">{a.name || a.id}</h4>
                <Badge color={statusToBadge(a.status)}>{a.status || "unknown"}</Badge>
              </div>
              <div className="agent-meta">
                <span>Type: {a.type || "n/a"}</span>
                <span>Version: {a.version || "n/a"}</span>
              </div>
            </div>
            <div className="agent-actions">
              <Link className="btn btn-primary" to={`/agents/${encodeURIComponent(a.id)}`}>
                View
              </Link>
              <Link className="btn btn-secondary" to={`/agents/${encodeURIComponent(a.id)}/logs`}>
                Logs
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AgentsList;
