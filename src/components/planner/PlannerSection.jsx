import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import TaskCard from "../tasks/TaskCard";

export default function PlannerSection({
  title,
  color = "success",
  tasks = [],
  emptyMessage = "No tasks available.",
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 560,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: `${color}.main`,
          color: "white",
          px: 2,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
        >
          {title}
        </Typography>

        <Chip
          label={tasks.length}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.18)",
            color: "white",
            fontWeight: 700,
            minWidth: 34,
          }}
        />
      </Box>

      {/* Task Area */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          overflowX: "hidden",
          bgcolor: "#fafafa",
        }}
      >
        {tasks.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{ mb: 1 }}
              >
                ✅
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight={600}
              >
                {emptyMessage}
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 1 }}
              >
                You're all caught up.
              </Typography>
            </Box>
          </Box>
        ) : (
          tasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                width: "100%",
                mb: 2,
              }}
            >
              <TaskCard task={task} />
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}
