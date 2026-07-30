import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import RestoreIcon from "@mui/icons-material/Restore";
import PaymentIcon from "@mui/icons-material/Payment";

import { canReactivateWithoutPayment } from "../../services/subscriptionLifecycleService";

export default function ReactivateSubscriptionDialog({
  open,
  subscription,
  onClose,
  onConfirm,
}) {
  const immediate = canReactivateWithoutPayment(subscription);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 4 },
      }}
    >
      <DialogTitle sx={{ pt: 4, px: 4, pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {immediate ? (
            <RestoreIcon sx={{ color: "#d97706", fontSize: 28 }} />
          ) : (
            <PaymentIcon sx={{ color: "#6366f1", fontSize: 28 }} />
          )}
          <Typography variant="h6" fontWeight={700}>
            {immediate ? "Reactivate Subscription" : "Reactivate PRO"}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pt: 2, pb: 1 }}>
        {immediate ? (
          <Stack spacing={2}>
            <Typography variant="body1" color="text.secondary">
              Your subscription is still active until the end of your current billing period.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No payment is required.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Reactivating will continue your existing subscription.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Typography variant="body1" color="text.secondary">
              Your subscription has expired.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              To continue using PRO features you must complete payment.
            </Typography>
            <Stack
              direction="row"
              alignItems="baseline"
              spacing={0.5}
              sx={{
                bgcolor: "grey.50",
                borderRadius: 3,
                px: 3,
                py: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h4" fontWeight={800}>
                R99
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={500}>
                /month
              </Typography>
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, pt: 2, gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2.5,
            px: 3,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onConfirm}
          color={immediate ? "warning" : "primary"}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2.5,
            px: 3,
          }}
        >
          {immediate ? "Reactivate" : "Proceed to Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
