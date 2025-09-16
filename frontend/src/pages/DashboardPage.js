import React, { useEffect, useState } from "react";
import { Container, Loader } from "../components/Layout";
import DashboardSummary from "../components/DashboardSummary";
import "../components/dashboard.css";
import { useApp } from "../context/AppContext";

// PUBLIC_INTERFACE
export default function DashboardPage() {
  /**
   * Overview dashboard for aggregate view of the agents.
   */
  const { api } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await api.getOverallDashboard();
    if (!res.error) setData(res.data || {});
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <Container>
      {loading ? <Loader text="Preparing dashboard..." /> : <DashboardSummary data={data} />}
    </Container>
  );
}
