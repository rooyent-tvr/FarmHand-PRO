import {
  Paper,
  Typography,
  Box,
} from "@mui/material";

import TodayIcon from "@mui/icons-material/Today";

import TaskCard from "./TaskCard";

export default function TodayTasks({ tasks = [] }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={3}
      >
        <TodayIcon color="primary" />

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Today's Tasks
        </Typography>
      </Box>

      {tasks.length === 0 ? (
        <Typography color="text.secondary">
          🎉 No tasks scheduled for today.
        </Typography>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))
      )}
    </Paper>
  );
}
