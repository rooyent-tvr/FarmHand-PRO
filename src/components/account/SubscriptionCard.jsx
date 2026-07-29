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

import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  getSubscription,
  upgradeToPro,
  cancelSubscription,
  reactivateSubscription,
} from "../../services/subscriptionService";

import UpgradeDialog from "./UpgradeDialog";
import CancelSubscriptionDialog from "./CancelSubscriptionDialog";

const PRO_FEATURES = [
  "AI Farm Intelligence",
  "Farm Intelligence Centre",
  "Predictive Analytics",
  "Unlimited Livestock",
  "Unlimited Crops",
  "Unlimited Machinery",
  "Unlimited Finance",
  "Advanced Reports",
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
    return (
      <Chip
        label="Active"
        size="small"
        color="success"
        sx={{ fontWeight: 700 }}
      />
    );
  }

  if (status === "Pending Cancellation") {
    return (
      <Chip
        label="Pending Cancellation"
        size="small"
        color="warning"
        sx={{ fontWeight: 700 }}
      />
    );
  }

  return (
    <Chip
      label="Starter"
      size="small"
      sx={{ fontWeight: 700 }}
    />
  );
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

  const cycle =
    billingCycle === "Yearly" ? "year" : "month";

  return `R${price}/${cycle}`;
}

export default function SubscriptionCard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [upgradeOpen, setUpgradeOpen] =
    useState(false);

  const [cancelOpen, setCancelOpen] =
    useState(false);

  async function loadSubscription() {
    try {
      setLoading(true);
      setError(false);

      const data = await getSubscription();

      setSubscription(data);
    } catch (err) {
      console.error("Subscription Error:", err);

      alert(
        JSON.stringify(
          {
            message: err?.message,
            code: err?.code,
            details: err?.details,
            hint: err?.hint,
          },
          null,
          2
        )
      );

      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscription();
  }, []);

  async function handleUpgrade() {
    try {
      await upgradeToPro();

      toast.success(
        "Subscription upgraded successfully."
      );

      setUpgradeOpen(false);

      await loadSubscription();
    } catch (err) {
      console.error(err);

      toast.error(
        err.message || "Unable to upgrade."
      );
    }
  }

  async function handleCancelConfirm() {
    try {
      await cancelSubscription();

      toast.success(
        "Subscription scheduled for cancellation."
      );

      setCancelOpen(false);

      await loadSubscription();
    } catch {
      toast.error(
        "Unable to cancel subscription."
      );
    }
  }

  async function handleReactivate() {
    try {
      await reactivateSubscription();

      toast.success("Subscription reactivated.");

      await loadSubscription();
    } catch {
      toast.error(
        "Unable to reactivate subscription."
      );
    }
  }

  if (loading) {
    return (
      <Card elevation={1} sx={{ borderRadius: 3 }}>
        <CardContent
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 220,
          }}
        >
          <CircularProgress color="success" />
        </CardContent>
      </Card>
    );
  }

  if (error || !subscription) {
    return (
      <Card elevation={1} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Alert severity="warning">
            No subscription found.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const plan = subscription?.plan ?? "Starter";
  const status = subscription?.status ?? "Active";
  const billingCycle =
    subscription?.billing_cycle ?? "Monthly";

  const isStarter =
    plan.toLowerCase() === "starter";

  const isPro =
    plan.toLowerCase() === "pro";

  const isPending =
    status === "Pending Cancellation";

  const features = isPro
    ? PRO_FEATURES
    : STARTER_FEATURES;

  return (
    <>
      <Card elevation={1} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <WorkspacePremiumIcon
                  color={isPro ? "warning" : "action"}
                />
                <Typography variant="h6" fontWeight={700}>
                  Subscription
                </Typography>
              </Stack>

              {getStatusChip(status)}
            </Stack>

            <Divider />

            {/* Plan Info */}
            <Stack spacing={1.5}>
              <InfoRow label="Plan" value={plan} />
              <InfoRow
                label="Price"
                value={formatPrice(subscription.price, billingCycle)}
              />
              <InfoRow label="Billing Cycle" value={billingCycle} />
              <InfoRow
                label="Renewal Date"
                value={formatDate(subscription.renewal_date)}
              />
              {subscription.payment_provider && (
                <InfoRow
                  label="Payment Provider"
                  value={subscription.payment_provider}
                />
              )}
            </Stack>

            <Divider />

            {/* Feature List */}
            <Box>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                {isPro ? "PRO FEATURES" : "STARTER FEATURES"}
              </Typography>

              <Stack spacing={0.5}>
                {features.map((feature) => (
                  <Typography
                    key={feature}
                    variant="body2"
                    sx={{ pl: 1 }}
                  >
                    • {feature}
                  </Typography>
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* Actions */}
            {isStarter && (
              <Button
                fullWidth
                variant="contained"
                color="warning"
                startIcon={<WorkspacePremiumIcon />}
                onClick={() => setUpgradeOpen(true)}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Upgrade to PRO
              </Button>
            )}

            {isPro && !isPending && (
              <Stack spacing={1.5}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CreditCardIcon />}
                    disabled
                    sx={{ textTransform: "none" }}
                  >
                    Manage Payment
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ReceiptLongIcon />}
                    disabled
                    sx={{ textTransform: "none" }}
                  >
                    Billing History
                  </Button>
                </Stack>

                <Button
                  fullWidth
                  color="error"
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setCancelOpen(true)}
                  sx={{ textTransform: "none" }}
                >
                  Cancel Subscription
                </Button>
              </Stack>
            )}

            {isPending && (
              <Button
                fullWidth
                color="success"
                variant="contained"
                startIcon={<WorkspacePremiumIcon />}
                onClick={handleReactivate}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Reactivate Subscription
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UpgradeDialog
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
      />

      <CancelSubscriptionDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancelConfirm}
      />
    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          textAlign: "right",
          minWidth: 140,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
