import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material";

import {
  Repeat,
  Edit,
  Update,
} from "@mui/icons-material";

export default function RecurringTaskDialog({
  open,
  task,
  onClose,
  onThisOccurrence,
  onEntireSeries,
}) {
  if (!task) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: 700,
        }}
      >
        <Repeat color="success" />
        Recurring Task
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography variant="body1">
            <strong>{task.title}</strong> is part of a recurring schedule.
          </Typography>

          <Typography color="text.secondary">
            Choose how you would like to edit this task.
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#f8f9fa",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="body2">
              <strong>This Occurrence Only</strong>
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Edit only this selected task.
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#fff8e1",
              border: "1px solid #ffe082",
            }}
          >
            <Typography variant="body2">
              <strong>Entire Recurring Schedule</strong>
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              This feature will be available in a future FarmHand PRO update.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Cancel
        </Button>

        <Button
          variant="outlined"
          startIcon={<Update />}
          disabled
        >
          Entire Series
        </Button>

        <Button
          variant="contained"
          color="success"
          startIcon={<Edit />}
          onClick={onThisOccurrence}
        >
          This Occurrence
        </Button>
      </DialogActions>
    </Dialog>
  );
}
