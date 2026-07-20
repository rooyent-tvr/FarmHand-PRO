import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import { CalendarMonth } from "@mui/icons-material";

function getPriorityColor(p) {
  if (p === "High") return "error";
  if (p === "Medium") return "warning";
  return "success";
}

export default function TodayPriorities({
  healthDue = 0,
  pregnant = 0,
  growing = 0,
  tasksDue = 0,
  onViewPlanner,
}) {
  const items = [];

  if (tasksDue > 0) {
    items.push({ icon: "📋", label: `${tasksDue} task${tasksDue === 1 ? "" : "s"} scheduled`, time: "Today", priority: "High" });
  }
  if (healthDue > 0) {
    items.push({ icon: "💉", label: `${healthDue} treatment${healthDue === 1 ? "" : "s"} due`, time: "Today", priority: "High" });
  }
  if (growing > 0) {
    items.push({ icon: "🌾", label: `${growing} crop${growing === 1 ? "" : "s"} growing`, time: "Active", priority: "Medium" });
  }
  if (pregnant > 0) {
    items.push({ icon: "🐄", label: `${pregnant} pregnancies`, time: "Monitor", priority: "High" });
  }

  const display = items.slice(0, 3);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>

        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.25 }}>
          <CalendarMonth sx={{ fontSize: 16, color: "primary.main" }} />
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: "0.8rem" }}>
            Smart Farm Planner
          </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, fontSize: "0.65rem" }}>
          Today's schedule.
        </Typography>

        <Stack spacing={1.25} sx={{ flex: 1 }}>
          {display.length === 0 ? (
            <Typography variant="caption" color="text.disabled">
              Nothing scheduled for today.
            </Typography>
          ) : (
            display.map((item, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: 13 }}>{item.icon}</Typography>
                <Typography variant="caption" sx={{ flex: 1, fontSize: "0.7rem" }} noWrap>
                  {item.label}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.6rem" }}>
                  {item.time}
                </Typography>
                <Chip
                  label={item.priority}
                  size="small"
                  color={getPriorityColor(item.priority)}
                  sx={{ height: 18, fontSize: "0.55rem", fontWeight: 700 }}
                />
              </Stack>
            ))
          )}
        </Stack>

        <Button
          variant="outlined"
          size="small"
          onClick={onViewPlanner}
          sx={{ mt: 2, textTransform: "none", fontSize: "0.7rem", fontWeight: 600, borderRadius: 1.5, alignSelf: "flex-start" }}
        >
          View planner
        </Button>

      </CardContent>
    </Card>
  );
}
