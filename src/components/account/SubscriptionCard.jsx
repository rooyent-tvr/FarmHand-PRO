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
      console.error(err);
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

  const plan =
    subscription?.plan ?? "Starter";

  const status =
    subscription?.status ?? "Active";

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

          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Feldrix Subscription Management
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Manage your Feldrix subscription
              </Typography>
            </Box>

            {getStatusChip(status)}
          </Box>

          {/* Plan */}
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ mt: 2 }}
          >
            {plan} Plan
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {formatPrice(
              subscription.price,
              billingCycle
            )}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2} sx={{ mb: 3 }}>
            <InfoRow
              label="Billing Cycle"
              value={billingCycle}
            />

            <InfoRow
              label="Price"
              value={formatPrice(
                subscription.price,
                billingCycle
              )}
            />

            <InfoRow
              label="Renewal Date"
              value={formatDate(
                subscription.renewal_date
              )}
            />

            <InfoRow
              label="Member Since"
              value={formatDate(
                subscription.created_at
              )}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Included Features
          </Typography>

          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {features.map((feature) => (
              <Box
                key={feature}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Typography
                  sx={{
                    color: "success.main",
                    fontSize: 16,
                  }}
                >
                  ✓
                </Typography>

                <Typography variant="body2">
                  {feature}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={1.5}>

            {isStarter && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<WorkspacePremiumIcon />}
                onClick={() => setUpgradeOpen(true)}
                sx={{
                  height: 48,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Upgrade to PRO
              </Button>
            )}

            {isPro && !isPending && (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  disabled
                  startIcon={<CreditCardIcon />}
                  sx={{
                    height: 48,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Manage Payment (Coming Soon)
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  disabled
                  startIcon={<ReceiptLongIcon />}
                  sx={{
                    height: 48,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Billing History
                </Button>

                <Button
                  fullWidth
                  color="error"
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setCancelOpen(true)}
                  sx={{
                    height: 48,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Cancel Subscription
                </Button>
              </>
            )}

            {isPending && (
              <Button
                fullWidth
                color="success"
                variant="contained"
                onClick={handleReactivate}
                sx={{
                  height: 48,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Reactivate Subscription
              </Button>
            )}

          </Stack>
        </CardContent>
      </Card>
	        <UpgradeDialog
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        onUpgrade={handleUpgrade}
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
