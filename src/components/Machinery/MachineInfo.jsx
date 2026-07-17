import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";

export default function MachineInfo({ machine }) {
  if (!machine) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
      >
        Machine Information
      </Typography>

      <Grid container spacing={2}>

        <Grid size={{ xs: 12, md: 6 }}>
          <InfoField
            label="Machine Name"
            value={machine.name}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <InfoField
            label="Category"
            value={machine.category}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <InfoField
            label="Brand"
            value={machine.brand}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <InfoField
            label="Model"
            value={machine.model}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <InfoField
            label="Registration"
            value={machine.registration}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <InfoField
            label="Purchase Date"
            value={machine.purchase_date}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <InfoField
            label="Purchase Price"
            value={`R${Number(
              machine.purchase_price || 0
            ).toLocaleString()}`}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <InfoField
            label="Current Hour Meter"
            value={`${machine.hour_meter || 0} hrs`}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <InfoField
            label="Notes"
            value={
              machine.notes || "No notes available."
            }
          />
        </Grid>

      </Grid>
    </Paper>
  );
}

function InfoField({ label, value }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: "100%",
        borderRadius: 2,
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
        sx={{ mt: 0.5 }}
      >
        {value || "-"}
      </Typography>
    </Paper>
  );
}