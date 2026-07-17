import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  Analytics,
  Build,
  AttachMoney,
  Schedule,
  Speed,
  Warning,
} from "@mui/icons-material";

function getDowntimeColor(downtime) {
  if (downtime <= 5) return "success";
  if (downtime <= 15) return "warning";
  return "error";
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
  // Empty / insufficient data state
  if (!analytics || !analytics.available) {
    return (
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Analytics sx={{ fontSize: 22, color: "#1976d2" }} />
            <Typography variant="subtitle1" fontWeight={700}>
              Machinery Insights
            </Typography>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ py: 3, textAlign: "center" }}>
            <Build sx={{ fontSize: 36, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" fontWeight={600}>
              Not enough service history yet.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Continue recording machinery services to unlock analytics.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const {
    costPerHour,
    averageServiceCost,
    totalMaintenanceCost,
    avgDaysBetweenServices,
    utilisation,
    downtime,
    insights = [],
  } = analytics;

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Analytics sx={{ fontSize: 22, color: "#1976d2" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Machinery Insights
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Metrics Grid */}
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 4 }}>
            <MetricCard
              icon={<AttachMoney sx={{ fontSize: 16, color: "#ed6c02" }} />}
              label="Cost / Hour"
              value={costPerHour != null ? `R${Number(costPerHour).toFixed(2)}` : "-"}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <MetricCard
              icon={<Build sx={{ fontSize: 16, color: "#1976d2" }} />}
              label="Avg Service Cost"
              value={averageServiceCost != null ? `R${Number(averageServiceCost).toLocaleString()}` : "-"}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <MetricCard
              icon={<AttachMoney sx={{ fontSize: 16, color: "#d32f2f" }} />}
              label="Total Maintenance"
              value={totalMaintenanceCost != null ? `R${Number(totalMaintenanceCost).toLocaleString()}` : "-"}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <MetricCard
              icon={<Schedule sx={{ fontSize: 16, color: "#7b1fa2" }} />}
              label="Avg Days Between"
              value={avgDaysBetweenServices != null ? `${avgDaysBetweenServices} days` : "-"}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Box>
              <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Speed sx={{ fontSize: 16, color: "#2e7d32" }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Utilisation
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={utilisation ?? 0}
                      sx={{
                        flex: 1,
                        height: 7,
                        borderRadius: 4,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          bgcolor: (utilisation ?? 0) >= 70 ? "#2e7d32" : "#f9a825",
                        },
                      }}
                    />
                    <Typography variant="body2" fontWeight={700}>
                      {utilisation ?? 0}%
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
              <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Warning sx={{ fontSize: 16, color: "#ed6c02" }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Downtime
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6" fontWeight={700}>
                    {downtime ?? 0}%
                  </Typography>
                  <Chip
                    label={downtime <= 5 ? "Good" : downtime <= 15 ? "Monitor" : "High"}
                    size="small"
                    color={getDowntimeColor(downtime ?? 0)}
                    sx={{ fontWeight: 700, fontSize: "0.6rem", height: 18 }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Insights */}
        {insights.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />

            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
              INSIGHTS
            </Typography>

            <Stack spacing={1}>
              {insights.map((insight, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: insight.severity === "high" ? "#d32f2f" : insight.severity === "medium" ? "#f9a825" : "#2e7d32",
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {insight.message}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </>
        )}

      </CardContent>
    </Card>
  );
}
