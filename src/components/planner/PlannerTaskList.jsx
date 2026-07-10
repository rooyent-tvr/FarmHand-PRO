import { Grid } from "@mui/material";
import PlannerSection from "./PlannerSection";

export default function PlannerTaskList({
  planner = {
    overdue: [],
    today: [],
    upcoming: [],
    completed: [],
  },
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

    const diff =
      (dueDate - todayDate) /
      (1000 * 60 * 60 * 24);

    if (diff <= 7) {
      thisWeek.push(task);
    } else {
      future.push(task);
    }
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <PlannerSection
          title="🔴 Overdue"
          color="error"
          tasks={overdue}
          emptyMessage="Great job! No overdue tasks."
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <PlannerSection
          title="🟠 Today's Tasks"
          color="warning"
          tasks={today}
          emptyMessage="Nothing scheduled for today."
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <PlannerSection
          title="🟢 This Week"
          color="success"
          tasks={thisWeek}
          emptyMessage="Nothing planned this week."
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <PlannerSection
          title="🔵 Future"
          color="info"
          tasks={future}
          emptyMessage="No future reminders."
        />
      </Grid>

      <Grid item xs={12}>
        <PlannerSection
          title="✅ Completed"
          color="secondary"
          tasks={completed}
          emptyMessage="No completed tasks yet."
        />
      </Grid>
    </Grid>
  );
}
