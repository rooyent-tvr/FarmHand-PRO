import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

const serviceTypes = [
  "Oil Change",
  "Minor Service",
  "Major Service",
  "Hydraulic",
  "Air Filter",
  "Fuel Filter",
  "Tyres",
  "Brakes",
  "Electrical",
  "Repair",
  "Other",
];

export default function ServiceEntryModal({
  open,
  onClose,
  onSave,
  machine,
}) {
  const [form, setForm] = useState({
    service_type: "Oil Change",
    service_date: new Date().toISOString().split("T")[0],
    hour_meter: machine?.hour_meter || 0,
    cost: "",
    workshop: "",
    invoice_number: "",
    notes: "",
  });

  useEffect(() => {
    if (machine) {
      setForm((previous) => ({
        ...previous,
        hour_meter: machine.hour_meter || 0,
      }));
    }
  }, [machine]);

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit() {
    onSave?.({
      ...form,
      machine_id: machine?.id,
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        🔧 Record Machine Service
      </DialogTitle>

      <DialogContent>

        <Grid
          container
          spacing={2}
          sx={{ mt: 1 }}
        >

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              select
              name="service_type"
              label="Service Type"
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
              type="date"
              name="service_date"
              label="Service Date"
              value={form.service_date}
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
              name="hour_meter"
              label="Hour Meter"
              value={form.hour_meter}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              name="cost"
              label="Service Cost"
              value={form.cost}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="workshop"
              label="Workshop / Mechanic"
              value={form.workshop}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              name="invoice_number"
              label="Invoice Number"
              value={form.invoice_number}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="notes"
              label="Notes"
              value={form.notes}
              onChange={handleChange}
            />
          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
        >
          Save Service
        </Button>

      </DialogActions>

    </Dialog>
  );
}