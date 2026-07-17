import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  Build,
  Edit,
  Visibility,
} from "@mui/icons-material";

import { format } from "date-fns";

function getStatusColor(status) {
  switch (status) {
    case "Active":
      return "success";
    case "In Service":
      return "warning";
    case "Retired":
      return "default";
    default:
      return "primary";
  }
}

function getServiceStatus(machine, maintenancePlan) {
  if (!maintenancePlan) return null;

  const currentHours = Number(machine.hour_meter || 0);
  const nextDue = Number(maintenancePlan.next_due_hours || 0);
  const remaining = nextDue - currentHours;

  if (remaining <= 0) return { label: "Overdue", color: "error" };
  if (remaining <= 50) return { label: "Due Soon", color: "warning" };
  return { label: "On Schedule", color: "success" };
}

export default function MachineCard({
  machine,
  onView,
  onEdit,
  onService,
  lastService,
  maintenancePlan,
  serviceHistory = [],
}) {
  const serviceStatus = getServiceStatus(machine, maintenancePlan);

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        transition: ".2s",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              🚜 {machine.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {machine.brand} {machine.model}
            </Typography>
          </Stack>

          <Chip
            label={machine.status}
            color={getStatusColor(machine.status)}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Category:</strong> {machine.category}
          </Typography>
          <Typography variant="body2">
            <strong>Registration:</strong> {machine.registration || "-"}
          </Typography>
          <Typography variant="body2">
            <strong>Hour Meter:</strong> {machine.hour_meter || 0} hrs
          </Typography>
          <Typography variant="body2">
            <strong>Purchase Price:</strong> R{Number(machine.purchase_price || 0).toLocaleString()}
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Maintenance Summary */}
        <Box sx={{ mb: 2 }}>
          {lastService ? (
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  🛠 Last Service
                </Typography>
                {serviceStatus && (
                  <Chip
                    label={serviceStatus.label}
                    color={serviceStatus.color}
                    size="small"
                    sx={{ height: 18, fontSize: "0.6rem", fontWeight: 700 }}
                  />
                )}
              </Stack>

              <Typography variant="caption" color="text.secondary">
                {format(new Date(lastService.service_date), "dd MMM yyyy")} — {lastService.service_type}
              </Typography>

              {maintenancePlan && (
                <Typography variant="caption" color="text.secondary">
                  🔧 Next at {maintenancePlan.next_due_hours} hrs
                  {" "}({Math.max(0, Number(maintenancePlan.next_due_hours || 0) - Number(machine.hour_meter || 0))} hrs remaining)
                </Typography>
              )}
            </Stack>
          ) : (
            <Typography variant="caption" color="text.disabled">
              No service history yet. Record the first service to begin tracking.
            </Typography>
          )}
        </Box>

        {/* Maintenance Snapshot */}
        {serviceHistory.length > 0 ? (
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              🔧 Services: <strong>{serviceHistory.length}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              💰 Total: <strong>R{serviceHistory.reduce((sum, s) => sum + (Number(s.cost) || 0), 0).toLocaleString()}</strong>
            </Typography>
          </Stack>
        ) : !lastService && (
          <Typography variant="caption" color="text.disabled" sx={{ mb: 2, display: "block" }}>
            No maintenance costs recorded yet.
          </Typography>
        )}

        {/* Action Buttons */}
        <Stack direction="row" spacing={1}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => onView?.(machine)}
          >
            View
          </Button>

          <Button
            type="button"
            fullWidth
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => onEdit?.(machine)}
          >
            Edit
          </Button>

          <Button
            type="button"
            fullWidth
            variant="contained"
            color="success"
            startIcon={<Build />}
            onClick={() => onService?.(machine)}
          >
            Service
          </Button>
        </Stack>

      </CardContent>
    </Card>
  );
}
