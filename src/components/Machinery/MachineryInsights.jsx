import { useNavigate } from "react-router-dom";

import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddTaskIcon from "@mui/icons-material/AddTask";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BuildIcon from "@mui/icons-material/Build";
import SpeedIcon from "@mui/icons-material/Speed";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ScheduleIcon from "@mui/icons-material/Schedule";

function getSeverityColor(severity) {
  switch (severity) {
    case "high": return "error";
    case "medium": return "warning";
    case "low": return "success";
    default: return "default";
  }
}

function getSeverityLabel(severity) {
  switch (severity) {
    case "high": return "Critical";
    case "medium": return "Attention";
    case "low": return "Info";
    default: return "Info";
  }
}

function getBadgeLabel(insights) {
  if (!insights || insights.length === 0) return "No Issues";
  const highCount = insights.filter((i) => i.severity === "high").length;
  if (highCount > 0) return `${highCount} Alert${highCount > 1 ? "s" : ""}`;
  return `${insights.length} Insight${insights.length > 1 ? "s" : ""}`;
}

function getBadgeColor(insights) {
  if (!insights || insights.length === 0) return "success";
  if (insights.some((i) => i.severity === "high")) return "error";
  if (insights.some((i) => i.severity === "medium")) return "warning";
  return "success";
}

function MetricCard({ icon, label, value }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
          {icon}
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            {label}
          </Typography>
        </Stack>
        <Typography variant="h6" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function MachineryInsights({ analytics }) {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();

  if (!analytics || !analytics.available) {
    return (
      <Card elevation={2} sx={{ borderRadius: 3, bgcolor: "background.paper" }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <TipsAndUpdatesIcon sx={{ fontSize: 22, color: "warning.main" }} />
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              Fleet Intelligence
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2.5 }} />
          <Typography color="text.secondary" variant="body2">
            Add machines and record services to unlock Fleet Intelligence.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const {
    costPerHour,
    averageServiceCost,
    totalMaintenanceCost,
    utilisation,
    downtime,
    insights = [],
  } = analytics;

  const allClear = insights.length === 0;

  function handleCreateTask(taskData) {
    if (!taskData) return;
    navigate("/planner", { state: { newTask: taskData } });
  }

  return (
    <Stack spacing={3}>
      {/* Metrics Grid */}
      <Card elevation={2} sx={{ borderRadius: 3, bgcolor: "background.paper" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6, md: 3 }}>
              <MetricCard
                icon={<AccountBalanceWalletIcon sx={{ fontSize: 16, color: "warning.main" }} />}
                label="Cost / Hour"
                value={costPerHour != null ? `R${Number(costPerHour).toFixed(2)}` : "—"}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <MetricCard
                icon={<BuildIcon sx={{ fontSize: 16, color: "primary.main" }} />}
                label="Avg Service"
                value={averageServiceCost ? `R${averageServiceCost.toLocaleString()}` : "—"}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <MetricCard
                icon={<SpeedIcon sx={{ fontSize: 16, color: "success.main" }} />}
                label="Utilisation"
                value={`${utilisation ?? 0}%`}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <MetricCard
                icon={<ScheduleIcon sx={{ fontSize: 16, color: "error.main" }} />}
                label="Downtime"
                value={`${downtime ?? 0}%`}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card elevation={2} sx={{ borderRadius: 3, bgcolor: "background.paper" }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <TipsAndUpdatesIcon sx={{ fontSize: 22, color: "warning.main" }} />
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              Fleet AI Recommendations
            </Typography>
            <Chip
              label={getBadgeLabel(allClear ? [] : insights)}
              size="small"
              color={getBadgeColor(allClear ? [] : insights)}
              sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22, ml: "auto" }}
            />
          </Stack>

          <Divider sx={{ mb: 2.5 }} />

          {allClear ? (
            <Stack alignItems="center" spacing={1.5} sx={{ py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 44, color: "success.main" }} />
              <Typography variant="h6" fontWeight={700} color="success.main">
                Fleet Operating Normally
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ lineHeight: 1.6, maxWidth: 320 }}>
                All machinery is operating within expected service intervals.
                No maintenance risks have been detected.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2.5}>
              {insights.map((rec) => (
                <Stack
                  key={rec.id}
                  spacing={1.5}
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    bgcolor: alpha(
                      rec.severity === "high" ? palette.error.main
                        : rec.severity === "medium" ? palette.warning.main
                        : palette.success.main,
                      0.04
                    ),
                    border: "1px solid",
                    borderColor: alpha(
                      rec.severity === "high" ? palette.error.main
                        : rec.severity === "medium" ? palette.warning.main
                        : palette.success.main,
                      0.12
                    ),
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Chip
                      label={getSeverityLabel(rec.severity)}
                      size="small"
                      color={getSeverityColor(rec.severity)}
                      sx={{ fontWeight: 600, fontSize: "0.65rem", height: 22, flexShrink: 0, mt: 0.1 }}
                    />
                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.primary" fontWeight={600} sx={{ lineHeight: 1.4 }}>
                        {rec.message}
                      </Typography>
                      {rec.reason && (
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                          {rec.reason}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ pl: 0.5, pt: 0.5 }}>
                    {rec.action && (
                      <Chip
                        label={rec.action}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: "0.65rem", height: 22 }}
                      />
                    )}
                    {rec.taskData && (
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<AddTaskIcon sx={{ fontSize: 14 }} />}
                        onClick={() => handleCreateTask(rec.taskData)}
                        sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.72rem", color: "primary.main", px: 1, minWidth: 0 }}
                      >
                        Create Task
                      </Button>
                    )}
                    {rec.route && (
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                        onClick={() => navigate(rec.route)}
                        sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.72rem", color: "info.main", px: 1, minWidth: 0 }}
                      >
                        View Machine
                      </Button>
                    )}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
