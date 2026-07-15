import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

import PageContainer from "../components/layout/PageContainer";

import PlannerToolbar from "../components/planner/PlannerToolbar";
import PlannerSearch from "../components/planner/PlannerSearch";
import PlannerFilters from "../components/planner/PlannerFilters";
import PlannerTaskList from "../components/planner/PlannerTaskList";
import ManualTaskModal from "../components/planner/ManualTaskModal";

import {
  createManualTask,
  completeManualTask,
  deleteManualTask,
  getPlannerTasks,
} from "../services/plannerService";

export default function PlannerWorkspace() {
  const location = useLocation();
  const plannerBoardRef = useRef(null);

  const [planner, setPlanner] = useState({
    overdue: [],
    today: [],
    upcoming: [],
    completed: [],
  });

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [taskModalOpen, setTaskModalOpen] =
    useState(false);

  useEffect(() => {
    loadPlanner();
  }, []);

  useEffect(() => {
    if (
      !loading &&
      location.search.includes("section=")
    ) {
      setTimeout(() => {
        plannerBoardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    }
  }, [loading, location]);

  async function loadPlanner() {
    try {
      const data = await getPlannerTasks();
      setPlanner(data);
    } catch (err) {
      console.error(
        "Planner Workspace:",
        err
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveTask(task) {
    try {
      await createManualTask(task);

      setTaskModalOpen(false);

      await loadPlanner();
    } catch (err) {
      console.error(
        "Create Manual Task:",
        err
      );
    }
  }

  async function handleCompleteTask(task) {
    try {
      if (task.status === "Completed") {
        await deleteManualTask(task.id);
      } else {
        await completeManualTask(task.id);
      }
      await loadPlanner();
    } catch (err) {
      console.error(
        "Task Action:",
        err
      );
    }
  }

  const filteredPlanner = useMemo(() => {
    const applyFilters = (tasks) =>
      tasks.filter((task) => {
        const matchesSearch =
          search.trim() === "" ||
          task.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          task.module
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          (task.animalTag || "")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const moduleKey = task.module
          .toLowerCase()
          .replace(/\s+/g, "");

        const matchesModule =
          filter === "all" ||
          moduleKey === filter ||
          (filter === "health" &&
            moduleKey === "animalhealth");

        return (
          matchesSearch &&
          matchesModule
        );
      });

    return {
      overdue: applyFilters(
        planner.overdue
      ),
      today: applyFilters(
        planner.today
      ),
      upcoming: applyFilters(
        planner.upcoming
      ),
      completed: applyFilters(
        planner.completed
      ),
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
      <PlannerToolbar
        onNewTask={() =>
          setTaskModalOpen(true)
        }
      />

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

      <Box
        ref={plannerBoardRef}
        sx={{ mt: 4 }}
      >
        <PlannerTaskList
          planner={filteredPlanner}
          onComplete={handleCompleteTask}
        />
      </Box>

      <ManualTaskModal
        open={taskModalOpen}
        onClose={() =>
          setTaskModalOpen(false)
        }
        onSave={handleSaveTask}
      />
    </PageContainer>
  );
}


