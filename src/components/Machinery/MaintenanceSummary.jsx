import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  Build,
  CalendarMonth,
  Speed,
  Store,
  Receipt,
  AttachMoney,
  Notes as NotesIcon,
} from "@mui/icons-material";

import { format } from "date-fns";

function getStatusInfo(remaining) {
  if (remaining <= 0) {
    return { label: "Service Overdue", color: "error", icon: "🔴" };
  }
  if (remaining <= 100) {
    return { label: "Service Due Soon", color: "warning", icon: "🟡" };
  }
  return { label: "On Schedule", color: "success", icon: "🟢" };
}

function StatCard({ title, value }) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        bgcolor: "#f5f5f5",
      }}
    >
      <CardContent sx={{ textAlign: "center", py: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mt: 0.5 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function MaintenanceSummary({
  machine,
  serviceHistory = [],
  maintenancePlan,
}) {
  const currentHours = Number(machine?.hour_meter || 0);
  const lastService = serviceHistory.length > 0 ? serviceHistory[0] : null;
  const lastServiceHours = Number(lastService?.hour_meter || 0);
  const nextDueHours = Number(maintenancePlan?.next_due_hours || 0);
  const remaining = maintenancePlan ? nextDueHours - currentHours : null;

  return (
    <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          📊 Maintenance Summary
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Section 1: Last Service */}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{ mb: 1.5 }}
        >
          🔧 Last Service
        </Typography>

        {lastService ? (
          <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Build color="success" />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {lastService.service_type}
                  </Typography>
                </Stack>
                <Chip
                  icon={<Speed />}
                  color="primary"
                  label={`${lastService.hour_meter} hrs`}
                  sx={{ fontWeight: 600 }}
                />
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonth fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Date:</strong>{" "}
                      {format(new Date(lastService.service_date), "dd MMM yyyy")}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AttachMoney fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Cost:</strong>{" "}
                      R{Number(lastService.cost || 0).toLocaleString()}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Store fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Workshop:</strong>{" "}
                      {lastService.workshop || "-"}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Receipt fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Invoice:</strong>{" "}
                      {lastService.invoice_number || "-"}
                    </Typography>
                  </Stack>
                </Grid>

                {lastService.notes && (
                  <Grid size={{ xs: 12 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <NotesIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
                      <Typography variant="body2">
                        <strong>Notes:</strong>{" "}
                        {lastService.notes}
                      </Typography>
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Card
            variant="outlined"
            sx={{ borderRadius: 3, mb: 3, p: 3, textAlign: "center" }}
          >
            <Build sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">
              No services have been recorded yet.
            </Typography>
          </Card>
        )}

        {/* Section 2: Maintenance Status */}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{ mb: 1.5 }}
        >
          🛠 Maintenance Status
        </Typography>

        {maintenancePlan ? (
          <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="body2">
                  <strong>Service Type:</strong> {maintenancePlan.service_type}
                </Typography>
                <Typography variant="body2">
                  <strong>Interval:</strong> Every {maintenancePlan.interval_hours} hours
                </Typography>
                <Typography variant="body2">
                  <strong>Next Due:</strong> {nextDueHours} hrs
                </Typography>
                <Typography variant="body2">
                  <strong>Remaining:</strong> {remaining} hrs
                </Typography>

                <Box sx={{ mt: 1 }}>
                  {(() => {
                    const status = getStatusInfo(remaining);
                    return (
                      <Chip
                        label={`${status.icon} ${status.label}`}
                        color={status.color}
                        sx={{ fontWeight: 700 }}
                      />
                    );
                  })()}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Card
            variant="outlined"
            sx={{ borderRadius: 3, mb: 3, p: 3, textAlign: "center" }}
          >
            <Typography color="text.secondary">
              No maintenance plan configured yet.
            </Typography>
          </Card>
        )}

        {/* Section 3: Quick Statistics */}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{ mb: 1.5 }}
        >
          📈 Quick Statistics
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Current Hours"
              value={`${currentHours}`}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Last Service"
              value={lastServiceHours ? `${lastServiceHours}` : "-"}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Next Due"
              value={maintenancePlan ? `${nextDueHours}` : "-"}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              title="Remaining"
              value={remaining !== null ? `${remaining}` : "-"}
            />
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
}
