
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CancelIcon from "@mui/icons-material/Cancel";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { getSubscription } from "../../services/subscriptionService";

export default function SubscriptionManagementCard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    try {
      const data = await getSubscription();
      setSubscription(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  const plan = subscription?.plan ?? "Starter";
  const status = subscription?.status ?? "Active";
  const price = Number(subscription?.price ?? 0);
  const billing = subscription?.billing_cycle ?? "Monthly";
  const renewal = subscription?.renewal_date
    ? new Date(subscription.renewal_date).toLocaleDateString()
    : "Not scheduled";
  const started = subscription?.created_at
    ? new Date(subscription.created_at).toLocaleDateString()
    : "-";

  const features = [
    "AI Farm Intelligence",
    "Advanced Reports",
    "Unlimited Livestock",
    "Unlimited Crops",
    "Priority Support",
  ];

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <WorkspacePremiumIcon color="warning" />
            <Typography variant="h6" fontWeight={700}>
              Subscription Management
            </Typography>
          </Stack>

          <Chip
            label={status}
            color={status === "Active" ? "success" : "default"}
          />
        </Stack>

        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">CURRENT PLAN</Typography>
            <Typography variant="h5" fontWeight={700}>{plan}</Typography>
          </Box>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Billing Cycle</Typography>
            <Typography fontWeight={600}>{billing}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Price</Typography>
            <Typography fontWeight={600}>R{price.toFixed(2)}/month</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Next Renewal</Typography>
            <Typography fontWeight={600}>{renewal}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Started</Typography>
            <Typography fontWeight={600}>{started}</Typography>
          </Stack>

          <Divider />

          <Typography fontWeight={700}>Included Features</Typography>

          {features.map((f) => (
            <Stack key={f} direction="row" spacing={1} alignItems="center">
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="body2">{f}</Typography>
            </Stack>
          ))}

          <Alert severity="info" sx={{ mt: 2 }}>
            Payment integration will be enabled in the next phase of Sprint 40.
          </Alert>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<CreditCardIcon />}
              disabled
            >
              Manage Payment
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<ReceiptLongIcon />}
              disabled
            >
              Billing History
            </Button>
          </Stack>

          <Button
            fullWidth
            color="error"
            variant="text"
            startIcon={<CancelIcon />}
            disabled
          >
            Cancel Subscription
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
