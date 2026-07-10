import {
  Paper,
  Typography,
  Box,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import TaskCard from "./TaskCard";

export default function OverdueTasks({ tasks = [] }) {
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
        <WarningAmberIcon color="error" />

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Overdue Tasks
        </Typography>
      </Box>

      {tasks.length === 0 ? (
        <Typography
          color="success.main"
          fontWeight={600}
        >
          🎉 Great job! No overdue tasks.
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
