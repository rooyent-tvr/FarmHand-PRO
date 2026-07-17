import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const serviceTypes = [
  "Oil Change",
  "Minor Service",
  "Major Service",
  "Air Filter",
  "Fuel Filter",
  "Hydraulic",
  "Tyres",
  "Brakes",
  "Electrical",
  "Repair",
  "Other",
];

export default function MaintenancePlan({
  machine,
  plan,
  onSave,
}) {
  const [form, setForm] = useState({
    service_type: "Oil Change",
    interval_hours: 250,
    next_due_hours: 250,
    active: true,
  });

  useEffect(() => {
    if (plan) {
      setForm({
        service_type: plan.service_type || "Oil Change",
        interval_hours: plan.interval_hours || 250,
        next_due_hours: plan.next_due_hours || 250,
        active: plan.active !== false,
        id: plan.id,
      });
      return;
    }

    if (machine) {
      const hours = Number(machine.hour_meter || 0);

      setForm({
        service_type: "Oil Change",
        interval_hours: 250,
        next_due_hours: hours + 250,
        active: true,
      });
    }
  }, [machine, plan]);

  function handleChange(event) {
    const { name, value } = event.target;

    const updated = {
      ...form,
      [name]: value,
    };

    if (name === "interval_hours") {
      updated.next_due_hours =
        Number(machine?.hour_meter || 0) +
        Number(value || 0);
    }

    setForm(updated);
  }

  function handleSwitch(event) {
    setForm((previous) => ({
      ...previous,
      active: event.target.checked,
    }));
  }

  function handleSubmit() {
    onSave?.({
      ...form,
      machine_id: machine?.id,
    });
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>

        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          🛠 Maintenance Plan
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Configure automatic maintenance reminders for this machine.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              select
              label="Service Type"
              name="service_type"
              value={form.service_type}
              onChange={handleChange}
            >
              {serviceTypes.map((type) => (
                <MenuItem
                  key={type}
                  value={type}
                >
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Interval (Hours)"
              name="interval_hours"
              value={form.interval_hours}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              disabled
              label="Current Hour Meter"
              value={machine?.hour_meter || 0}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              disabled
              label="Next Service Due"
              value={`${form.next_due_hours} hrs`}
            />
          </Grid>

        </Grid>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ mt: 3 }}
        >
          <Typography>
            Maintenance Plan Active
          </Typography>

          <Switch
            checked={form.active}
            onChange={handleSwitch}
          />
        </Stack>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
          >
            Save Maintenance Plan
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
}