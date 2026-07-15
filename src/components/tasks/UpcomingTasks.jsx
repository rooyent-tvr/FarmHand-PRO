import {
  Paper,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";

import TaskCard from "./TaskCard";

export default function UpcomingTasks({ tasks = [] }) {
  const MAX_VISIBLE = 5;

  const visibleTasks = tasks.slice(0, MAX_VISIBLE);
  const remainingTasks = Math.max(
    tasks.length - MAX_VISIBLE,
    0
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
      >
        <EventIcon color="success" />

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Upcoming Tasks
        </Typography>
      </Box>

      {tasks.length === 0 ? (
        <Typography color="text.secondary">
          No upcoming tasks scheduled.
        </Typography>
      ) : (
        <>
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}

          {remainingTasks > 0 && (
            <>
              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                color="success"
                sx={{
                  borderRadius: 3,
                  fontWeight: 700,
                }}
              >
                + {remainingTasks} More Reminder
                {remainingTasks !== 1 ? "s" : ""}
              </Button>
            </>
          )}
        </>
      )}
    </Paper>
  );
}

