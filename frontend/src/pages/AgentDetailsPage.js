import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Button } from "../components/Layout";
import AgentDetail from "../components/AgentDetail";
import "../components/agentDetail.css";
import { useApp } from "../context/AppContext";

// PUBLIC_INTERFACE
export default function AgentDetailsPage() {
  /**
   * Page for a single agent detail and controls.
   */
  const { agentId } = useParams();
  const { api } = useApp();

  return (
    <Container>
      <Card
        title="Navigation"
        right={<Link className="btn btn-secondary" to={`/agents/${encodeURIComponent(agentId)}/logs`}>View Logs</Link>}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="btn btn-secondary" to="/agents">Back to Agents</Link>
          <Link className="btn btn-secondary" to="/dashboard">Dashboard</Link>
        </div>
      </Card>
      <AgentDetail agentId={agentId} api={api} />
    </Container>
  );
}
