import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  Agriculture,
  Build,
  Edit,
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

export default function MachineHeader({
  machine,
  onEdit,
  onService,
}) {
  if (!machine) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        mb: 3,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={3}
      >
        <Box>

          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
          >
            🚜 {machine.name}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {machine.brand} {machine.model}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Chip
              icon={<Agriculture />}
              label={machine.category}
              color="primary"
            />

            <Chip
              label={machine.status}
              color={getStatusColor(machine.status)}
            />

            <Chip
              icon={<Schedule />}
              label={`${machine.hour_meter || 0} hrs`}
            />
          </Stack>

        </Box>

        <Stack
          spacing={1}
          alignItems={{
            xs: "stretch",
            md: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="success"
            startIcon={<Build />}
            onClick={() => onService?.(machine)}
          >
            Record Service
          </Button>

          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => onEdit?.(machine)}
          >
            Edit Machine
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        <InfoItem
          label="Registration"
          value={machine.registration || "-"}
        />

        <InfoItem
          label="Purchase Date"
          value={machine.purchase_date || "-"}
        />

        <InfoItem
          label="Purchase Price"
          value={`R${Number(
            machine.purchase_price || 0
          ).toLocaleString()}`}
        />

        <InfoItem
          label="Status"
          value={machine.status}
        />
      </Box>
    </Paper>
  );
}

function InfoItem({
  label,
  value,
}) {
  return (
    <Box
      sx={{
        bgcolor: "#f8f9fa",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        variant="body1"
        fontWeight={600}
      >
        {value}
      </Typography>
    </Box>
  );
}