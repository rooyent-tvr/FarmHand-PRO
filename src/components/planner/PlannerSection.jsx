import {
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import TaskCard from "../tasks/TaskCard";

export default function PlannerSection({
  title,
  color = "success",
  tasks = [],
  emptyMessage = "No tasks available.",
  onComplete,
}) {
  const enableScroll = tasks.length > 6;

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        mb: 4,
      }}
    >
      <Box
        sx={{
          bgcolor: `${color}.main`,
          color: "white",
          px: 3,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          {title}
        </Typography>

        <Chip
          label={tasks.length}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,.20)",
            color: "white",
            fontWeight: 700,
          }}
        />
      </Box>

      <Box
        sx={{
          p: 3,
          bgcolor: "#fafafa",
        }}
      >
        {tasks.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="h3">
              ✅
            </Typography>

            <Typography
              variant="h6"
              fontWeight={600}
              mt={2}
            >
              {emptyMessage}
            </Typography>

            <Typography
              variant="body2"
              mt={1}
            >
              You're all caught up.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: enableScroll ? 430 : "auto",
              overflowY: enableScroll ? "auto" : "visible",
              pr: enableScroll ? 1 : 0,
            }}
          >
            <Grid container spacing={2.5}>
              {tasks.map((task) => (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  key={task.id}
                >
                  <TaskCard
                    task={task}
                    onComplete={onComplete}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
