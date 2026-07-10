import {
  Paper,
  Typography,
  Box,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import TaskCard from "./TaskCard";

export default function CompletedTasks({ tasks = [] }) {
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
        <CheckCircleIcon color="success" />

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Completed Tasks
        </Typography>
      </Box>

      {tasks.length === 0 ? (
        <Typography color="text.secondary">
          No completed tasks yet.
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
