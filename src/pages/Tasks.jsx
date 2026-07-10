import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Grid } from "@mui/material";

import PageContainer from "../components/layout/PageContainer";

import PlannerHeader from "../components/tasks/PlannerHeader";
import PlannerSummary from "../components/tasks/PlannerSummary";
import TodayTasks from "../components/tasks/TodayTasks";
import UpcomingTasks from "../components/tasks/UpcomingTasks";
import OverdueTasks from "../components/tasks/OverdueTasks";
import CompletedTasks from "../components/tasks/CompletedTasks";

import { getPlannerTasks } from "../services/plannerService";

export default function Tasks() {
  const navigate = useNavigate();

  const [planner, setPlanner] = useState({
    today: [],
    upcoming: [],
    overdue: [],
    completed: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanner();
  }, []);

  async function loadPlanner() {
    try {
      const data = await getPlannerTasks();
      setPlanner(data);
    } catch (err) {
      console.error("Planner error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <PageContainer
        title="📅 Smart Farm Planner"
        subtitle="Loading planner..."
      />
    );
  }

  return (
    <PageContainer
      title="📅 Smart Farm Planner"
      subtitle="Stay ahead with today's priorities and upcoming farm activities."
    >
      <PlannerHeader
        onWorkspace={() => navigate("/planner")}
      />

      <PlannerSummary
        today={planner.today.length}
        upcoming={planner.upcoming.length}
        overdue={planner.overdue.length}
        completed={planner.completed.length}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <TodayTasks tasks={planner.today} />
        </Grid>

        <Grid item xs={12} lg={4}>
          <UpcomingTasks tasks={planner.upcoming} />
        </Grid>

        <Grid item xs={12} lg={4}>
          <OverdueTasks tasks={planner.overdue} />
        </Grid>

        <Grid item xs={12} lg={8}>
          <CompletedTasks tasks={planner.completed} />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
