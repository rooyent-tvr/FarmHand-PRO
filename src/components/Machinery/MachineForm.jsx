import { useState } from "react";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const categories = [
  "Tractor",
  "Vehicle",
  "Implement",
  "Trailer",
  "Harvester",
  "Sprayer",
  "Planter",
  "Pump",
  "Generator",
  "Other",
];

const statuses = [
  "Active",
  "In Service",
  "Retired",
];

export default function MachineForm({
  onSave,
  onCancel,
  initialValues = {},
}) {
  const [form, setForm] = useState({
    name: "",
    category: "Tractor",
    brand: "",
    model: "",
    registration: "",
    purchase_date: "",
    purchase_price: "",
    hour_meter: "",
    status: "Active",
    notes: "",
    ...initialValues,
  });

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSave?.(form);
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        gutterBottom
      >
        🚜 Machine Information
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Machine Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  value={category}
                >
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Model"
              name="model"
              value={form.model}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Registration / Serial Number"
              name="registration"
              value={form.registration}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              type="date"
              fullWidth
              label="Purchase Date"
              name="purchase_date"
              value={form.purchase_date}
              onChange={handleChange}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Purchase Price"
              name="purchase_price"
              value={form.purchase_price}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Current Hour Meter"
              name="hour_meter"
              value={form.hour_meter}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              {statuses.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
            >
              Save Machine
            </Button>

            {onCancel && (
              <Button
                variant="outlined"
                size="large"
                onClick={onCancel}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            )}
          </Grid>

        </Grid>
      </Box>
    </Paper>
  );
}