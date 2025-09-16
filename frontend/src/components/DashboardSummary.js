import React from "react";
import { Badge, Card } from "./Layout";

// PUBLIC_INTERFACE
export const DashboardSummary = ({ data }) => {
  /**
   * Displays aggregate stats for the dashboard
   */
  const totals = data?.totals || {};
  const health = data?.health || {};
  const throughput = data?.throughput || {};
  const alerts = data?.alerts || [];

  return (
    <>
      <Card title="Totals">
        <div className="metrics">
          <div className="metric">
            <div className="metric-value">{totals.agents ?? "-"}</div>
            <div className="metric-label">Agents</div>
          </div>
          <div className="metric">
            <div className="metric-value">{totals.online ?? "-"}</div>
            <div className="metric-label">Online</div>
          </div>
          <div className="metric">
            <div className="metric-value">{totals.offline ?? "-"}</div>
            <div className="metric-label">Offline</div>
          </div>
          <div className="metric">
            <div className="metric-value">{totals.errors ?? "-"}</div>
            <div className="metric-label">Errors (24h)</div>
          </div>
        </div>
      </Card>

      <Card title="Health">
        <div className="health">
          <div>
            <div className="metric-value">{health.healthy ?? "-"}</div>
            <div className="metric-label">Healthy</div>
          </div>
          <div>
            <div className="metric-value">{health.degraded ?? "-"}</div>
            <div className="metric-label">Degraded</div>
          </div>
          <div>
            <div className="metric-value">{health.unhealthy ?? "-"}</div>
            <div className="metric-label">Unhealthy</div>
          </div>
        </div>
      </Card>

      <Card title="Throughput">
        <div className="metrics">
          <div className="metric">
            <div className="metric-value">{throughput.cmdPerMin ?? "-"}</div>
            <div className="metric-label">Cmd/min</div>
          </div>
          <div className="metric">
            <div className="metric-value">{throughput.eventsPerMin ?? "-"}</div>
            <div className="metric-label">Events/min</div>
          </div>
        </div>
      </Card>

      <Card title="Active Alerts">
        {alerts.length === 0 ? (
          <div>No active alerts</div>
        ) : (
          <ul className="alerts">
            {alerts.map((a, i) => (
              <li key={i}>
                <Badge color={a.level === "critical" ? "danger" : a.level === "warning" ? "warning" : "default"}>
                  {a.level}
                </Badge>{" "}
                {a.message}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
};

export default DashboardSummary;
