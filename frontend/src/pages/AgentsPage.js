import React, { useEffect, useState } from "react";
import { Container, Loader } from "../components/Layout";
import AgentsList from "../components/AgentsList";
import "../components/agents.css";
import { useApp } from "../context/AppContext";

// PUBLIC_INTERFACE
export default function AgentsPage() {
  /**
   * Page to display all agents with a refresh action.
   */
  const { api } = useApp();
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);

  const load = async () => {
    setLoading(true);
    const res = await api.getAgents();
    if (!res.error) setAgents(res.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); // eslint-disable-next-line
  }, []);

  return (
    <Container>
      {loading ? <Loader text="Loading agents..." /> : <AgentsList agents={agents} onRefresh={load} />}
    </Container>
  );
}
