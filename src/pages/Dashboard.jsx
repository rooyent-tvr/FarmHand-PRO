import { useEffect, useState } from "react";

import PageContainer from "../components/layout/PageContainer";
import HeroBanner from "../components/dashboard/HeroBanner";
import FarmSummary from "../components/dashboard/FarmSummary";
import StatsGrid from "../components/dashboard/StatsGrid";
import CropStatsGrid from "../components/dashboard/CropStatsGrid";
import StatusChart from "../components/dashboard/StatusChart";
import RecentAnimals from "../components/dashboard/RecentAnimals";
import RecentCrops from "../components/dashboard/RecentCrops";
import RecentPurchases from "../components/dashboard/RecentPurchases";
import HeaviestAnimal from "../components/dashboard/HeaviestAnimal";
import BreedingAlerts from "../components/dashboard/BreedingAlerts";

import { getDashboardStats } from "../services/dashboardService";
import { getHealthRecords } from "../services/healthService";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [healthDue, setHealthDue] = useState(0);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const [dash, health] = await Promise.all([
        getDashboardStats(),
        getHealthRecords(),
      ]);

      setDashboard(dash);

      const today = new Date();
      today.setHours(0,0,0,0);

      const due = (health || []).filter(r => {
        if (!r.next_due) return false;
        const d = new Date(r.next_due);
        d.setHours(0,0,0,0);
        return d <= today;
      });

      setHealthDue(due.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading || !dashboard) return <h2>Loading dashboard...</h2>;

  const animals = dashboard.animals || [];
  const crops = dashboard.crops || [];
  const latestBreeding = dashboard.latestBreeding || null;

  return (
    <PageContainer
      title="🌾 Farm Dashboard"
      subtitle="Monitor your livestock, crops and daily farm activities from one place."
    >
      <HeroBanner
        totalAnimals={dashboard.totalAnimals}
        totalCrops={dashboard.totalCrops}
        pregnantBreeding={dashboard.pregnantBreeding}
        healthDue={healthDue}
      />

      {healthDue > 0 && (
        <div style={{
          background:"#FFF3E0",
          border:"1px solid #FFB74D",
          color:"#E65100",
          padding:16,
          borderRadius:10,
          marginBottom:20,
          fontWeight:600
        }}>
          ⚠️ {healthDue} treatment{healthDue!==1?"s":""} due. Open the Animal Health page to review them.
        </div>
      )}

      <FarmSummary dashboard={dashboard} />
      <StatsGrid
        animals={animals}
        pregnantBreeding={dashboard.pregnantBreeding}
      />
      <CropStatsGrid crops={crops} />

      <div style={{ marginTop: 20 }}>
        <BreedingAlerts
          pregnant={dashboard.pregnantBreeding}
          dueSoon={dashboard.dueSoonBreeding}
          overdue={dashboard.overdueBreeding}
          latestBreeding={latestBreeding}
        />
      </div>

      <div style={{marginTop:20}}>
        <HeaviestAnimal animals={animals} />
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginTop:20}}>
        <StatusChart animals={animals} />
        <RecentPurchases animals={animals} />
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginTop:20}}>
        <RecentAnimals animals={animals} />
        <RecentCrops crops={crops} />
      </div>
    </PageContainer>
  );
}
