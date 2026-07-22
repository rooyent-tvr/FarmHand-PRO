import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Grid, Stack } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

import PageContainer from "../components/layout/PageContainer";

import HeroBanner from "../components/dashboard/HeroBanner";
import AIInsights from "../components/dashboard/AIInsights";
import ActionCenter from "../components/dashboard/ActionCenter";
import TodayPriorities from "../components/dashboard/TodayPriorities";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";
import FarmHealthScore from "../components/dashboard/FarmHealthScore";
import WeatherSummary from "../components/dashboard/WeatherSummary";
import FarmTimeline from "../components/dashboard/FarmTimeline";
import NotificationCenter from "../components/dashboard/NotificationCenter";

import { getDashboardStats } from "../services/dashboardService";
import { getHealthRecords } from "../services/healthService";
import { getNotifications } from "../services/notificationService";
import { getWeatherSummary } from "../services/weatherService";
import { calculateFarmHealthScore } from "../utils/farmHealthScore";
import { generateAIInsights } from "../utils/aiInsights";
import { generateFarmTimeline } from "../utils/farmTimeline";
import { generateActionCenter } from "../utils/actionCenter";
import { getFarmInsights } from "../services/intelligence";
import { getNotifications as getEngineNotifications } from "../services/notificationEngine";
import { getSmartDashboardCards } from "../services/dashboard/smartCards";
import { getDailyFarmBriefing } from "../services/dashboard/dailyBriefing";
import { useNotificationBadge } from "../context/NotificationContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { setUnreadCount } = useNotificationBadge();

  const [dashboard, setDashboard] = useState(null);
  const [healthDue, setHealthDue] = useState(0);
  const [notifications, setNotifications] = useState(null);
  const [weather, setWeather] = useState(null);
  const [engineNotifications, setEngineNotifications] = useState([]);
  const [smartCards, setSmartCards] = useState([]);
  const [dailyBriefing, setDailyBriefing] = useState(null);
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

      // Assemble unified farm data object for all engines
      const farmData = {
        planner: {
          overdue: notifs?.planner?.overdue || [],
          today: notifs?.planner?.today || [],
          upcoming: notifs?.planner?.upcoming || [],
          completed: notifs?.planner?.completed || [],
          tasks: [
            ...(notifs?.planner?.overdue || []),
            ...(notifs?.planner?.today || []),
            ...(notifs?.planner?.upcoming || []),
          ],
        },
        livestock: {
          animals: dash?.animals || [],
          healthRecords: health || [],
          breedingRecords: dash?.breedingRecords || [],
          weightRecords: dash?.weightRecords || [],
        },
        crops: {
          crops: dash?.crops || [],
        },
        finance: { records: dash?.financeRecords || [] },
        machinery: {
          machines: dash?.machines || [],
          maintenancePlans: dash?.maintenancePlans || [],
          serviceHistory: dash?.serviceHistory || [],
        },
        weather: weatherData,
        intelligence: { insights: [] },
        system: { events: [] },
      };

      // Intelligence Engine
      const insights = await getFarmInsights(farmData);
      farmData.intelligence.insights = insights;

      // Notification Engine
      const engineNotifs = getEngineNotifications(farmData);
      setEngineNotifications(engineNotifs);
      setUnreadCount(engineNotifs.filter((n) => !n.read).length);

      // Smart Card Engine
      setSmartCards(getSmartDashboardCards(farmData));

      // Daily Briefing Engine
      const briefing = getDailyFarmBriefing({
        ...farmData,
        notifications: engineNotifs,
      });
      setDailyBriefing(briefing);
    } catch {
      // Graceful fallback
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

  // Derived values for presentation engines
  const plannerOverdue = Number(notifications?.planner?.overdue?.length || 0);
  const plannerToday = Number(notifications?.planner?.today?.length || 0);
  const growingCrops = (dashboard.crops || []).filter((c) => c.status === "Growing").length;

  const farmHealth = calculateFarmHealthScore({
    planner: { overdue: plannerOverdue },
    health: { attention: Number(healthDue || 0) },
    machinery: { overdue: Number(notifications?.modules?.machinery || 0) },
    crops: { overdue: 0 },
    finance: { profit: 0 },
  });

  const aiInsights = generateAIInsights({
    planner: { overdue: plannerOverdue },
    health: { attention: Number(healthDue || 0) },
    machinery: { overdue: Number(notifications?.modules?.machinery || 0) },
    crops: { harvestSoon: 0 },
    finance: { profit: 0 },
    weather,
  });

  const farmTimeline = generateFarmTimeline({
    planner: { overdue: plannerOverdue },
    health: { attention: Number(healthDue || 0) },
    machinery: { overdue: Number(notifications?.modules?.machinery || 0) },
    crops: { harvestSoon: 0 },
    finance: { profit: 0 },
  });

  const actions = generateActionCenter({
    planner: { overdue: plannerOverdue, today: plannerToday },
    health: { attention: Number(healthDue || 0) },
    machinery: { overdue: Number(notifications?.modules?.machinery || 0) },
    breeding: { birthsDue: Number(notifications?.modules?.breeding || 0) },
    crops: { harvestSoon: 0 },
    finance: { profit: 0 },
    weather,
    predictions: [],
    aiInsights,
  });

  return (
    <PageContainer fullWidth>
      <Stack spacing={3}>

        {/* HERO BANNER */}
        <HeroBanner
          weather={weather}
          farmHealthScore={farmHealth.score}
          farmHealthStatus={farmHealth.status}
          smartCards={smartCards}
          onCardClick={(route) => navigate(route)}
          dailyBriefing={dailyBriefing}
        />

        {/* OPERATIONS CENTRE */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <AIInsights
              insights={aiInsights}
              onViewAll={() => navigate("/planner")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ActionCenter
              actions={actions}
              onViewAll={() => navigate("/planner")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TodayPriorities
              healthDue={healthDue}
              pregnant={dashboard.pregnantBreeding}
              growing={growingCrops}
              tasksDue={plannerOverdue + plannerToday}
              onViewPlanner={() => navigate("/planner")}
            />
          </Grid>
        </Grid>

        {/* QUICK ACTIONS */}
        <DashboardQuickActions />

        {/* FARM OVERVIEW */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FarmHealthScore
              score={farmHealth.score}
              status={farmHealth.status}
              breakdown={farmHealth.breakdown}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <WeatherSummary weather={weather} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FarmTimeline events={farmTimeline} />
          </Grid>
        </Grid>

        {/* NOTIFICATION CENTER */}
        <NotificationCenter
          notifications={engineNotifications}
          onNotificationClick={(n) => navigate(n.route || "/dashboard")}
          onMarkAsRead={() => {}}
          onClear={() => {}}
        />

        {/* VIEW ANALYTICS */}
        <Stack direction="row" justifyContent="center" sx={{ pt: 1, pb: 2 }}>
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/reports")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              fontSize: "0.8rem",
            }}
          >
            View Farm Analytics
          </Button>
        </Stack>

      </Stack>
    </PageContainer>
  );
}
