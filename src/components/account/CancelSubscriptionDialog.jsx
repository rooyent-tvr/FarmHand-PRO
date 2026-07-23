
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function CancelSubscriptionDialog({
  open,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Cancel PRO Subscription
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Alert
            severity="warning"
            icon={<WarningAmberIcon />}
          >
            Your PRO subscription will remain active until the end of your
            current billing period.
          </Alert>

          <Typography>
            If you continue:
          </Typography>

          <Stack spacing={1}>
            <Typography>• Your account will automatically move to the Starter plan.</Typography>
            <Typography>• Your farm data will remain safe.</Typography>
            <Typography>• Premium features will be locked after your billing period ends.</Typography>
            <Typography>• You can upgrade back to PRO at any time.</Typography>
          </Stack>

          <Alert severity="info">
            No livestock, crop, finance, machinery or planner data will be deleted.
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Keep PRO
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
        >
          Cancel Subscription
        </Button>
      </DialogActions>
    </Dialog>
  );
}
