import { useEffect, useState } from "react";

import StatsGrid from "../components/dashboard/StatsGrid";
import StatusChart from "../components/dashboard/StatusChart";
import RecentAnimals from "../components/dashboard/RecentAnimals";
import RecentPurchases from "../components/dashboard/RecentPurchases";
import HeaviestAnimal from "../components/dashboard/HeaviestAnimal";

import { getAnimals } from "../services/livestockService";

export default function Dashboard() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const data = await getAnimals();
      setAnimals(data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  return (
    <div>
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

      {/* Dashboard Statistics */}
      <StatsGrid animals={animals} />

      {/* Heaviest Animal */}
      <div style={{ marginTop: 20 }}>
        <HeaviestAnimal animals={animals} />
      </div>

      {/* Status Chart + Recent Purchases */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <StatusChart animals={animals} />

        <RecentPurchases animals={animals} />
      </div>

      {/* Recent Livestock */}
      <RecentAnimals animals={animals} />
    </div>
  );
}
