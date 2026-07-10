import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";

import PageContainer from "../components/layout/PageContainer";

import PlannerToolbar from "../components/planner/PlannerToolbar";
import PlannerSearch from "../components/planner/PlannerSearch";
import PlannerFilters from "../components/planner/PlannerFilters";
import PlannerTaskList from "../components/planner/PlannerTaskList";

import { getPlannerTasks } from "../services/plannerService";

export default function PlannerWorkspace() {
  const [planner, setPlanner] = useState({
    overdue: [],
    today: [],
    upcoming: [],
    completed: [],
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadPlanner();
  }, []);

  async function loadPlanner() {
    try {
      const data = await getPlannerTasks();
      setPlanner(data);
    } catch (err) {
      console.error("Planner Workspace:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredPlanner = useMemo(() => {
    const applyFilters = (tasks) =>
      tasks.filter((task) => {
        const matchesSearch =
          search.trim() === "" ||
          task.title
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          task.module
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (task.animalTag || "")
            .toLowerCase()
            .includes(search.toLowerCase());

        const moduleKey = task.module
          .toLowerCase()
          .replace(/\s+/g, "");

        const matchesModule =
          filter === "all" ||
          moduleKey === filter;

        return matchesSearch && matchesModule;
      });

    return {
      overdue: applyFilters(planner.overdue),
      today: applyFilters(planner.today),
      upcoming: applyFilters(planner.upcoming),
      completed: applyFilters(planner.completed),
    };
  }, [planner, search, filter]);

  if (loading) {
    return (
      <PageContainer
        fullWidth
        title="🧠 Planner Workspace"
        subtitle="Loading planner..."
      />
    );
  }

  return (
    <PageContainer
      fullWidth
      title="🧠 Planner Workspace"
      subtitle="Manage your farm reminders from one intelligent workspace."
    >
      <PlannerToolbar />

      <PlannerSearch
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <Box sx={{ mt: 3 }}>
        <PlannerFilters
          value={filter}
          onChange={setFilter}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <PlannerTaskList
          planner={filteredPlanner}
        />
      </Box>
    </PageContainer>
  );
}
