import { useEffect, useState } from "react";

import { Box, Grid, Stack } from "@mui/material";

import PageContainer from "../components/layout/PageContainer";

import HeroBanner from "../components/dashboard/HeroBanner";
import FarmHealthScore from "../components/dashboard/FarmHealthScore";
import AIInsights from "../components/dashboard/AIInsights";
import FarmTimeline from "../components/dashboard/FarmTimeline";
import PredictiveInsights from "../components/dashboard/PredictiveInsights";
import NotificationCard from "../components/dashboard/NotificationCard";
import ActionCenter from "../components/dashboard/ActionCenter";
import TodayPriorities from "../components/dashboard/TodayPriorities";
import DashboardKPIs from "../components/dashboard/DashboardKPIs";
import BreedingAlerts from "../components/dashboard/BreedingAlerts";
import HeaviestAnimal from "../components/dashboard/HeaviestAnimal";
import StatusChart from "../components/dashboard/StatusChart";
import RecentPurchases from "../components/dashboard/RecentPurchases";
import RecentAnimals from "../components/dashboard/RecentAnimals";
import RecentCrops from "../components/dashboard/RecentCrops";

import { getDashboardStats } from "../services/dashboardService";
import { getHealthRecords } from "../services/healthService";
import { getNotifications } from "../services/notificationService";
import { completeManualTask } from "../services/plannerService";
import { getWeatherSummary } from "../services/weatherService";
import { calculateFarmHealthScore } from "../utils/farmHealthScore";
import { generateAIInsights } from "../utils/aiInsights";
import { generateFarmTimeline } from "../utils/farmTimeline";
import { generatePredictiveInsights } from "../utils/predictiveInsights";
import { generateActionCenter } from "../utils/actionCenter";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [healthDue, setHealthDue] = useState(0);
  const [notifications, setNotifications] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const [dash, health, notifs, weatherData] = await Promise.all([
        getDashboardStats(),
        getHealthRecords(),
        getNotifications(),
        getWeatherSummary(),
      ]);

      setDashboard(dash);
      setNotifications(notifs);
      setWeather(weatherData);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const due = (health || []).filter((record) => {
        if (!record.next_due) return false;

        const dueDate = new Date(record.next_due);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate <= today;
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

  async function handleCompleteDashboardTask(task) {
    try {
      await completeManualTask(task.id);
      await loadDashboard();
    } catch (err) {
      console.error("Dashboard complete task:", err);
    }
  }

  if (loading || !dashboard) {
    return <h2>Loading dashboard...</h2>;
  }

  const animals = dashboard.animals || [];
  const crops = dashboard.crops || [];
  const latestBreeding = dashboard.latestBreeding || null;

  const farmHealth = calculateFarmHealthScore({
    planner: {
      overdue: Number(notifications?.planner?.overdue?.length || 0),
    },

    health: {
      attention: Number(healthDue || 0),
    },

    machinery: {
      overdue: Number(notifications?.modules?.machinery || 0),
    },

    crops: {
      overdue: 0,
    },

    finance: {
      profit: 0,
    },
  });

  const aiInsights = generateAIInsights({
    planner: {
      overdue: Number(notifications?.planner?.overdue?.length || 0),
    },

    health: {
      attention: Number(healthDue || 0),
    },

    machinery: {
      overdue: Number(notifications?.modules?.machinery || 0),
    },

    crops: {
      harvestSoon: 0,
    },

    finance: {
      profit: 0,
    },

    weather,
  });

  const farmTimeline = generateFarmTimeline({
    planner: {
      overdue: Number(
        notifications?.planner?.overdue?.length || 0
      ),
    },

    health: {
      attention: Number(healthDue || 0),
    },

    machinery: {
      overdue: Number(
        notifications?.modules?.machinery || 0
      ),
    },

    crops: {
      harvestSoon: 0,
    },

    finance: {
      profit: 0,
    },
  });

  const predictions = generatePredictiveInsights({
    machinery: {},
    breeding: {},
    crops: { crops },
    planner: {
      upcomingCount: Number(notifications?.planner?.upcoming?.length || 0),
      overdueCount: Number(notifications?.planner?.overdue?.length || 0),
    },
  });

  const actions = generateActionCenter({
    planner: {
      overdue: Number(notifications?.planner?.overdue?.length || 0),
      today: Number(notifications?.planner?.today?.length || 0),
    },
    health: {
      attention: Number(healthDue || 0),
    },
    machinery: {
      overdue: Number(notifications?.modules?.machinery || 0),
    },
    breeding: {
      birthsDue: Number(notifications?.modules?.breeding || 0),
    },
    crops: {
      harvestSoon: 0,
    },
    finance: {
      profit: 0,
    },
    weather,
    predictions,
    aiInsights,
  });

  const growingCrops = crops.filter(
    (crop) => crop.status === "Growing"
  ).length;

  return (
    <PageContainer
      title="🌾 Farm Dashboard"
      subtitle="Monitor your livestock, crops and daily farm activities from one place."
    >
      {/* Hero Banner */}

      <HeroBanner
        totalAnimals={dashboard.totalAnimals}
        totalCrops={dashboard.totalCrops}
        pregnantBreeding={dashboard.pregnantBreeding}
        healthDue={healthDue}
        weather={weather}
      />

      {/* Action Centre */}

      <div style={{ marginTop: 24 }}>
        <ActionCenter actions={actions} />
      </div>

      {/* Operations Center (2x2 grid) */}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Top Left: Farm Health Score */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FarmHealthScore
            score={farmHealth.score}
            status={farmHealth.status}
            breakdown={farmHealth.breakdown}
          />
        </Grid>

        {/* Top Right: AI Assistant */}
        <Grid size={{ xs: 12, md: 6 }}>
          <AIInsights insights={aiInsights} />
        </Grid>

        {/* Bottom Left: Predictive Insights */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PredictiveInsights predictions={predictions} />
        </Grid>

        {/* Bottom Right: Farm Activity */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FarmTimeline events={farmTimeline} />
        </Grid>
      </Grid>

      {/* Notification Card */}

      <div style={{ marginTop: 24 }}>
        <NotificationCard
          notifications={notifications}
        />
      </div>

      {/* Health Warning */}

      {healthDue > 0 && (
        <Box sx={{ mt: 3 }}>
          <div
            style={{
              background: "#FFF8E1",
              border: "1px solid #FFCC80",
              color: "#E65100",
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
              fontWeight: 600,
            }}
          >
            ⚠️ {healthDue} treatment
            {healthDue !== 1 ? "s are" : " is"} due today.
            Please review the Animal Health module.
          </div>
        </Box>
      )}

      {/* Today's Priorities */}

      <TodayPriorities
        healthDue={healthDue}
        pregnant={dashboard.pregnantBreeding}
        growing={growingCrops}
        tasksDue={0}
      />

      {/* Farm KPIs */}

      <div style={{ marginTop: 24 }}>
        <DashboardKPIs
          dashboard={dashboard}
          healthDue={healthDue}
        />
      </div>

      {/* Breeding Alerts */}

      <div style={{ marginTop: 24 }}>
        <BreedingAlerts
          pregnant={dashboard.pregnantBreeding}
          dueSoon={dashboard.dueSoonBreeding}
          overdue={dashboard.overdueBreeding}
          latestBreeding={latestBreeding}
        />
      </div>

      {/* Heaviest Animal */}

      <div style={{ marginTop: 24 }}>
        <HeaviestAnimal animals={animals} />
      </div>

      {/* Analytics */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          marginTop: 24,
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
          marginTop: 24,
        }}
      >
        <RecentAnimals animals={animals} />
        <RecentCrops crops={crops} />
      </div>
    </PageContainer>
  );
}
