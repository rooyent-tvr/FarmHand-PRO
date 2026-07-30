import { Box } from "@mui/material";
import PlannerSection from "./PlannerSection";

export default function PlannerTaskList({
  planner = {
    overdue: [],
    today: [],
    upcoming: [],
    completed: [],
  },
  onComplete,
  onEdit,
}) {
  const overdue = planner.overdue || [];
  const today = planner.today || [];
  const completed = planner.completed || [];
  const upcoming = planner.upcoming || [];

  const thisWeek = [];
  const future = [];

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  upcoming.forEach((task) => {
    if (!task.originalDate) {
      future.push(task);
      return;
    }

    const dueDate = new Date(task.originalDate);
    dueDate.setHours(0, 0, 0, 0);

    const diff = (dueDate - todayDate) / (1000 * 60 * 60 * 24);

    if (diff <= 7) {
      thisWeek.push(task);
    } else {
      future.push(task);
    }
  });

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(auto-fit, minmax(300px, 1fr))",
        },
        gap: 2.5,
        alignItems: "start",
      }}
    >
      <PlannerSection
        title="Overdue"
        color="error"
        tasks={overdue}
        emptyMessage="No overdue tasks."
        onComplete={onComplete}
        onEdit={onEdit}
      />

      <PlannerSection
        title="Today's Tasks"
        color="warning"
        tasks={today}
        emptyMessage="Nothing scheduled today."
        onComplete={onComplete}
        onEdit={onEdit}
      />

      <PlannerSection
        title="This Week"
        color="success"
        tasks={thisWeek}
        emptyMessage="Nothing this week."
        onComplete={onComplete}
        onEdit={onEdit}
      />

      <PlannerSection
        title="Future"
        color="info"
        tasks={future}
        emptyMessage="No future tasks."
        onComplete={onComplete}
        onEdit={onEdit}
      />

      <PlannerSection
        title="Completed"
        color="secondary"
        tasks={completed}
        emptyMessage="No completed tasks."
        onComplete={onComplete}
        onEdit={onEdit}
      />
    </Box>
  );
}
