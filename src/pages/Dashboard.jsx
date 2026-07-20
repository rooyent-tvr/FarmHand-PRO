import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Grid, Stack } from "@mui/material";

import PageContainer from "../components/layout/PageContainer";

import HeroBanner from "../components/dashboard/HeroBanner";
import FarmHealthScore from "../components/dashboard/FarmHealthScore";
import AIInsights from "../components/dashboard/AIInsights";
import FarmTimeline from "../components/dashboard/FarmTimeline";
import PredictiveInsights from "../components/dashboard/PredictiveInsights";
import FarmIntelligenceCenter from "../components/dashboard/FarmIntelligenceCenter";
import NotificationCard from "../components/dashboard/NotificationCard";
import ActionCenter from "../components/dashboard/ActionCenter";
import TodayPriorities from "../components/dashboard/TodayPriorities";
import HeaviestAnimal from "../components/dashboard/HeaviestAnimal";
import StatusChart from "../components/dashboard/StatusChart";
import RecentFarmActivity from "../components/dashboard/RecentFarmActivity";

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
import { getFarmInsights } from "../services/intelligence";

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [healthDue, setHealthDue] = useState(0);
  const [notifications, setNotifications] = useState(null);
  const [weather, setWeather] = useState(null);
  const [farmInsights, setFarmInsights] = useState([]);
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

      // =====================================================
      // Farm Intelligence Engine
      // Build farmData from all loaded datasets
      // =====================================================

      const farmData = {
        // Planner data
        planner: {
          overdue: notifs?.planner?.overdue || [],
          today: notifs?.planner?.today || [],
          upcoming: notifs?.planner?.upcoming || [],
          completed: notifs?.planner?.completed || [],
        },

        // Livestock data
        livestock: {
          animals: dash?.animals || [],
          healthRecords: health || [],
          breedingRecords: dash?.breedingRecords || [],
          weightRecords: dash?.weightRecords || [],
        },

        // Crop data
        crops: dash?.crops || [],

        // Finance data
        finance: {
          records: dash?.financeRecords || [],
        },

        // Machinery data
        machinery: {
          machines: dash?.machines || [],
          maintenancePlans: dash?.maintenancePlans || [],
          serviceHistory: dash?.serviceHistory || [],
        },

        // Weather data
        weather: weatherData,

        // Future providers: Irrigation, Inventory, Market, Sustainability
      };

      const insights = await getFarmInsights(farmData);
      setFarmInsights(insights);
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

  const plannerOverdue = Number(notifications?.planner?.overdue?.length || 0);
  const plannerToday = Number(notifications?.planner?.today?.length || 0);

  return (
    <PageContainer
      fullWidth
      title="🌾 Farm Dashboard"
      subtitle="Monitor your livestock, crops and daily farm activities from one place."
    >
      <Stack spacing={3}>

        {/* Hero Banner */}
        <HeroBanner
          totalAnimals={dashboard.totalAnimals}
          totalCrops={dashboard.totalCrops}
          pregnantBreeding={dashboard.pregnantBreeding}
          healthDue={healthDue}
          weather={weather}
          machineryCount={Number(notifications?.modules?.machinery || 0)}
          plannerOverdue={plannerOverdue}
          plannerToday={plannerToday}
          farmHealthScore={farmHealth.score}
          farmHealthStatus={farmHealth.status}
        />

        {/* Operations Centre */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <AIInsights insights={aiInsights} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <ActionCenter actions={actions} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TodayPriorities
              healthDue={healthDue}
              pregnant={dashboard.pregnantBreeding}
              growing={growingCrops}
              tasksDue={plannerOverdue + plannerToday}
            />
          </Grid>
        </Grid>

        {/* Intelligence & Analytics */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FarmHealthScore
              score={farmHealth.score}
              status={farmHealth.status}
              breakdown={farmHealth.breakdown}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <PredictiveInsights predictions={predictions} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FarmTimeline events={farmTimeline} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FarmIntelligenceCenter
              insights={farmInsights}
              onAction={(route, payload) => navigate(route, { state: payload ? { payload } : {} })}
            />
          </Grid>
        </Grid>

        {/* Notifications + Activity */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <NotificationCard notifications={notifications} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecentFarmActivity animals={animals} crops={crops} />
          </Grid>
        </Grid>

        {/* Health Warning */}
        {healthDue > 0 && (
          <Box
            sx={{
              bgcolor: "#FFF8E1",
              border: "1px solid #FFCC80",
              color: "#E65100",
              p: 2,
              borderRadius: 3,
              fontWeight: 600,
            }}
          >
            ⚠️ {healthDue} treatment
            {healthDue !== 1 ? "s are" : " is"} due today.
            Please review the Animal Health module.
          </Box>
        )}

        {/* Analytics */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <StatusChart animals={animals} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <HeaviestAnimal animals={animals} />
          </Grid>
        </Grid>

      </Stack>
    </PageContainer>
  );
}
