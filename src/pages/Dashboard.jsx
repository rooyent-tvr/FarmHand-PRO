import { useEffect, useState } from "react";

import StatsGrid from "../components/dashboard/StatsGrid";
import CropStatsGrid from "../components/dashboard/CropStatsGrid";
import StatusChart from "../components/dashboard/StatusChart";
import RecentAnimals from "../components/dashboard/RecentAnimals";
import RecentCrops from "../components/dashboard/RecentCrops";
import RecentPurchases from "../components/dashboard/RecentPurchases";
import HeaviestAnimal from "../components/dashboard/HeaviestAnimal";

import { getDashboardStats } from "../services/dashboardService";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const data = await getDashboardStats();
      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading || !dashboard) {
    return <h2>Loading dashboard...</h2>;
  }

  const animals = dashboard.animals || [];
  const crops = dashboard.crops || [];

  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <h1
        style={{
          marginBottom: "10px",
        }}
      >
        🌾 Farm Dashboard
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "6px",
        }}
      >
        Welcome back to FarmHand PRO
      </p>

      <p
        style={{
          color: "#999",
          fontSize: "13px",
          marginBottom: "30px",
        }}
      >
        Last Updated: {new Date().toLocaleString("en-ZA")}
      </p>

      {/* Livestock Statistics */}
      <StatsGrid animals={animals} />

      {/* Crop Statistics */}
      <CropStatsGrid crops={crops} />

      {/* Heaviest Animal */}
      <div style={{ marginTop: 20 }}>
        <HeaviestAnimal animals={animals} />
      </div>

      {/* Charts and Purchases */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <StatusChart animals={animals} />

        <RecentPurchases animals={animals} />
      </div>

      {/* Recent Activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <RecentAnimals animals={animals} />

        <RecentCrops crops={crops} />
      </div>
    </div>
  );
}
