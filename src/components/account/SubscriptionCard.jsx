import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";

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

import {
  getSubscription,
  cancelSubscription,
} from "../../services/subscriptionService";

import CancelSubscriptionDialog from "./CancelSubscriptionDialog";

const PRO_FEATURES = [
  "AI Farm Intelligence",
  "Advanced Reports",
  "Unlimited Livestock",
  "Unlimited Crops",
  "Priority Support",
];

const STARTER_FEATURES = [
  "Basic Dashboard",
  "Up to 20 Animals",
  "Up to 5 Crops",
  "Community Support",
];

function getStatusChip(status) {
  if (status === "Active") {
    return <Chip label="Active" size="small" color="success" sx={{ fontWeight: 700 }} />;
  }
  if (status === "Pending Cancellation") {
    return <Chip label="Pending Cancellation" size="small" color="warning" sx={{ fontWeight: 700 }} />;
  }
  return <Chip label="Starter" size="small" sx={{ fontWeight: 700 }} />;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "dd MMM yyyy");
  } catch {
    return "—";
  }
}

function formatPrice(price, billingCycle) {
  if (!price || price === 0) return "Free";
  const cycle = billingCycle === "Yearly" ? "Year" : "Month";
  return `R${price} / ${cycle}`;
}

export default function SubscriptionCard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadSubscription() {
    try {
      setLoading(true);
      setError(false);
      const data = await getSubscription();
      setSubscription(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscription();
  }, []);

  async function handleCancelConfirm() {
    try {
      await cancelSubscription();
      toast.success("Subscription scheduled for cancellation.");
      setDialogOpen(false);
      await loadSubscription();
    } catch {
      toast.error("Unable to cancel subscription.");
    }
  }

  if (loading) {
    return (
      <Card elevation={1} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <CircularProgress color="success" />
        </CardContent>
      </Card>
    );
  }

  if (error || !subscription) {
    return (
      <Card elevation={1} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Alert severity="warning">No subscription found.</Alert>
        </CardContent>
      </Card>
    );
  }

  const isPro = subscription.plan === "Pro";
  const features = isPro ? PRO_FEATURES : STARTER_FEATURES;

  return (
    <Card elevation={1} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 4 }}>

        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Subscription Management
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Manage your FarmHand PRO subscription
            </Typography>
          </Box>
          {getStatusChip(subscription.status)}
        </Box>

        {/* Plan + Price */}
        <Typography variant="h5" fontWeight={800} sx={{ mt: 2 }}>
          {subscription.plan || "Starter"} Plan
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {formatPrice(subscription.price, subscription.billing_cycle)}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Information rows */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <InfoRow label="Billing Cycle" value={subscription.billing_cycle || "Monthly"} />
          <InfoRow label="Price" value={formatPrice(subscription.price, subscription.billing_cycle)} />
          <InfoRow label="Renewal Date" value={formatDate(subscription.renewal_date)} />
          <InfoRow label="Member Since" value={formatDate(subscription.created_at)} />
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Features */}
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
          Included Features
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {features.map((feature) => (
            <Box key={feature} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography sx={{ color: "success.main", fontSize: 16, lineHeight: 1 }}>✓</Typography>
              <Typography variant="body2">{feature}</Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        <Stack spacing={1.5}>
          <Button
            variant="contained"
            fullWidth
            disabled
            sx={{
              textTransform: "none",
              fontWeight: 600,
              height: 48,
              borderRadius: 2,
            }}
          >
            Manage Payment — Coming Soon
          </Button>

          <Button
            variant="outlined"
            fullWidth
            disabled
            sx={{
              textTransform: "none",
              fontWeight: 600,
              height: 48,
              borderRadius: 2,
            }}
          >
            Billing History
          </Button>

          <Button
            variant="contained"
            color="error"
            fullWidth
            disabled={!isPro}
            onClick={() => setDialogOpen(true)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              height: 48,
              borderRadius: 2,
            }}
          >
            Cancel Subscription
          </Button>
        </Stack>

      </CardContent>

      <CancelSubscriptionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleCancelConfirm}
      />
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, textAlign: "right", minWidth: 140 }}>
        {value}
      </Typography>
    </Box>
  );
}
