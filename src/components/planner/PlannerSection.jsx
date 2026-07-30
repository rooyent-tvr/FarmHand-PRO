import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import TaskCard from "../tasks/TaskCard";
import { PremiumEmptyState } from "../../design";

export default function PlannerSection({
  title,
  color = "success",
  tasks = [],
  emptyMessage = "No tasks available.",
  onComplete,
  onEdit,
}) {
  const enableScroll = tasks.length > 5;

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: 3 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          bgcolor: `${color}.main`,
          color: "white",
          px: 2.5,
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} sx={{ letterSpacing: 0.3 }}>
          {title}
        </Typography>

        <Chip
          label={tasks.length}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,.20)",
            color: "white",
            fontWeight: 700,
            height: 20,
            fontSize: "0.7rem",
          }}
        />
      </Box>

      {/* Content — single column, full-width cards */}
      <Box
        sx={{
          p: 2,
          bgcolor: "background.paper",
          flex: 1,
          maxHeight: enableScroll ? 520 : "auto",
          overflowY: enableScroll ? "auto" : "visible",
        }}
      >
        {tasks.length === 0 ? (
          <Box sx={{ py: 3 }}>
            <PremiumEmptyState title="All Clear" message={emptyMessage} />
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onComplete}
                onEdit={onEdit}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
