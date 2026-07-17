import {
  Box,
  Button,
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
  Edit,
  Delete,
  Receipt,
  Speed,
  Store,
  AttachMoney,
  Notes as NotesIcon,
} from "@mui/icons-material";

import { format } from "date-fns";

export default function ServiceHistory({
  records = [],
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
      }}
    >
      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            🔧 Service History
          </Typography>

          <Button
            variant="contained"
            color="success"
            startIcon={<Build />}
            onClick={onAdd}
          >
            Record Service
          </Button>
        </Stack>

        {records.length === 0 && (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
            }}
          >
            <Build sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />

            <Typography
              variant="h6"
              gutterBottom
            >
              No service history
            </Typography>

            <Typography
              color="text.secondary"
            >
              Record your first machine service to start tracking.
            </Typography>
          </Box>
        )}

        <Stack spacing={2}>

          {records.map((service) => (
            <Card
              key={service.id}
              variant="outlined"
              sx={{ borderRadius: 3 }}
            >
              <CardContent>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Build color="success" />
                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {service.service_type}
                    </Typography>
                  </Stack>

                  <Chip
                    icon={<Speed />}
                    color="primary"
                    label={`${service.hour_meter} hrs`}
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
                        {format(new Date(service.service_date), "dd MMM yyyy")}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AttachMoney fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Cost:</strong>{" "}
                        R{Number(service.cost || 0).toLocaleString()}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Store fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Workshop:</strong>{" "}
                        {service.workshop || "-"}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Receipt fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Invoice:</strong>{" "}
                        {service.invoice_number || "-"}
                      </Typography>
                    </Stack>
                  </Grid>

                  {service.notes && (
                    <Grid size={{ xs: 12 }}>
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <NotesIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
                        <Typography variant="body2">
                          <strong>Notes:</strong>{" "}
                          {service.notes}
                        </Typography>
                      </Stack>
                    </Grid>
                  )}
                </Grid>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ mt: 2.5 }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => onEdit?.(service)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={() => onDelete?.(service)}
                  >
                    Delete
                  </Button>
                </Stack>

              </CardContent>
            </Card>
          ))}

        </Stack>

      </CardContent>
    </Card>
  );
}
