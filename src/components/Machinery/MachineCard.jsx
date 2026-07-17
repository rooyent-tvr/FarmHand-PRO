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
  Schedule,
} from "@mui/icons-material";

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

export default function MachineCard({
  machine,
  onView,
  onEdit,
  onService,
}) {
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

            <Typography
              variant="h6"
              fontWeight={700}
            >
              🚜 {machine.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
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
            <strong>Registration:</strong>{" "}
            {machine.registration || "-"}
          </Typography>

          <Typography variant="body2">
            <strong>Hour Meter:</strong>{" "}
            {machine.hour_meter || 0} hrs
          </Typography>

          <Typography variant="body2">
            <strong>Purchase Price:</strong>{" "}
            R
            {Number(
              machine.purchase_price || 0
            ).toLocaleString()}
          </Typography>

        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction="row"
          spacing={1}
        >
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

        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Schedule
            fontSize="small"
            color="action"
          />

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Maintenance planner coming soon
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );
}
