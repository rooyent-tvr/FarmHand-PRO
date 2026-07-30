import { useState } from "react";
import { differenceInDays, format } from "date-fns";
import toast from "react-hot-toast";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentsIcon from "@mui/icons-material/Payments";
import DownloadIcon from "@mui/icons-material/Download";
import HistoryIcon from "@mui/icons-material/History";
import CancelIcon from "@mui/icons-material/Cancel";
import RestoreIcon from "@mui/icons-material/Restore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ReactivateSubscriptionDialog from "./ReactivateSubscriptionDialog";
import {
  getReactivateMode,
  reactivateSubscription as reactivateSubscriptionLifecycle,
} from "../../services/subscriptionLifecycleService";
import { startUpgradePayment } from "../../services/paymentService";
import { getCurrentUser } from "../../services/profileService";

function formatDate(date) {
  if (!date) return "\u2014";

  try {
    return format(new Date(date), "dd MMM yyyy");
  } catch {
    return "\u2014";
  }
}

export default function BillingDashboard({
  subscription,
  onBillingHistory,
  onManagePayment,
  onDownloadInvoice,
  onCancel,
  onReactivate,
}) {
  if (!subscription) {
    return (
      <Alert severity="warning">
        Subscription not available.
      </Alert>
    );
  }

  const plan = subscription.plan || "Starter";
  const status = subscription.status || "Active";
  const price = Number(subscription.price || 0);
  const billingCycle = subscription.billing_cycle || "Monthly";
  const paymentProvider = subscription.payment_provider || "PayFast";

  const renewalDate = subscription.renewal_date
    ? new Date(subscription.renewal_date)
    : null;

  const daysRemaining = renewalDate
    ? Math.max(differenceInDays(renewalDate, new Date()), 0)
    : null;

  const lifetimePayments = price;

  const isPending = status === "Pending Cancellation" || status === "Cancelled";
  const isActive = status === "Active";

  const [reactivateOpen, setReactivateOpen] = useState(false);

  function handleReactivateClick() {
    setReactivateOpen(true);
  }

  async function handleReactivateConfirm() {
    const mode = getReactivateMode(subscription);

    if (mode === "immediate") {
      try {
        await reactivateSubscriptionLifecycle(subscription);
        setReactivateOpen(false);
        toast.success("Subscription reactivated.");
        if (onReactivate) onReactivate();
      } catch (err) {
        toast.error(err.message || "Unable to reactivate subscription.");
      }
    } else {
      // Payment required — launch PayFast checkout
      setReactivateOpen(false);

      try {
        const user = await getCurrentUser();

        if (!user) {
          toast.error("Please log in to continue.");
          return;
        }

        toast("Redirecting to PayFast...", { icon: "\uD83D\uDCB3" });

        await startUpgradePayment({
          customer: {
            firstName: user.user_metadata?.full_name?.split(" ")[0] || user.user_metadata?.name?.split(" ")[0] || "",
            lastName: user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || user.user_metadata?.name?.split(" ").slice(1).join(" ") || "",
            email: user.email || "",
          },
          subscriptionId: subscription.id,
        });
      } catch (err) {
        console.error("Payment flow error:", err);
        toast.error(err.message || "Unable to start payment. Please try again.");
      }
    }
  }

  return (
    <Stack spacing={5}>

      {/* ================================================================
          KPI CARDS
          ================================================================ */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md>
          <KpiCard
            label="Current Plan"
            value={plan}
            subtitle={`${billingCycle} billing`}
            icon={<WorkspacePremiumIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(251,191,36,0.12)"
            iconColor="#d97706"
          />
        </Grid>
        <Grid item xs={12} sm={6} md>
          <KpiCard
            label="Next Renewal"
            value={formatDate(subscription.renewal_date)}
            subtitle={daysRemaining !== null ? `${daysRemaining} days remaining` : "Not scheduled"}
            icon={<CalendarMonthIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(99,102,241,0.12)"
            iconColor="#6366f1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md>
          <KpiCard
            label="Total Paid"
            value={`R${lifetimePayments.toFixed(2)}`}
            subtitle="Lifetime payments"
            icon={<PaymentsIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(34,197,94,0.12)"
            iconColor="#16a34a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md>
          <KpiCard
            label="Payment Method"
            value={paymentProvider}
            subtitle="Active method"
            icon={<CreditCardIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(14,165,233,0.12)"
            iconColor="#0ea5e9"
          />
        </Grid>

        {isActive && (
          <Grid item xs={12} sm={6} md>
            <KpiCard
              label="Subscription"
              value="Cancel"
              subtitle="Downgrade to Starter"
              icon={<CancelIcon sx={{ fontSize: 28 }} />}
              iconBg="rgba(239,68,68,0.08)"
              iconColor="#dc2626"
              onClick={onCancel}
              danger
            />
          </Grid>
        )}

        {isPending && onReactivate && (
          <Grid item xs={12} sm={6} md>
            <KpiCard
              label="Reactivate"
              value="Reactivate"
              subtitle="Restore PRO membership"
              icon={<RestoreIcon sx={{ fontSize: 28 }} />}
              iconBg="rgba(245,158,11,0.1)"
              iconColor="#d97706"
              onClick={handleReactivateClick}
              amber
            />
          </Grid>
        )}
      </Grid>

      {/* ================================================================
          QUICK ACTIONS
          ================================================================ */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          transition: "box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3.5, pt: 3.5, pb: 2 }}>
            <Typography variant="body1" fontWeight={700} sx={{ fontSize: "1rem" }}>
              Quick Actions
            </Typography>
          </Box>

          <Divider />

          <ActionRow
            icon={<CreditCardIcon sx={{ fontSize: 24 }} />}
            iconBg="rgba(99,102,241,0.1)"
            iconColor="#6366f1"
            title="Manage Payment"
            description="Update your payment method or card details"
            onClick={onManagePayment}
          />

          <Divider sx={{ mx: 3.5 }} />

          <ActionRow
            icon={<HistoryIcon sx={{ fontSize: 24 }} />}
            iconBg="rgba(14,165,233,0.1)"
            iconColor="#0ea5e9"
            title="Billing History"
            description="View invoices and payment history"
            onClick={onBillingHistory}
          />

          <Divider sx={{ mx: 3.5 }} />

          <ActionRow
            icon={<DownloadIcon sx={{ fontSize: 24 }} />}
            iconBg="rgba(34,197,94,0.1)"
            iconColor="#16a34a"
            title="Download Latest Invoice"
            description="Download your latest invoice as PDF"
            onClick={onDownloadInvoice}
          />

          <Box sx={{ height: 8 }} />
        </CardContent>
      </Card>

      <ReactivateSubscriptionDialog
        open={reactivateOpen}
        subscription={subscription}
        onClose={() => setReactivateOpen(false)}
        onConfirm={handleReactivateConfirm}
      />
    </Stack>
  );
}

function KpiCard({ label, value, subtitle, icon, iconBg, iconColor, onClick, danger, amber }) {
  const accentColor = danger ? "rgba(239,68,68," : amber ? "rgba(245,158,11," : null;

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: danger
          ? "rgba(239,68,68,0.25)"
          : amber
          ? "rgba(245,158,11,0.25)"
          : "divider",
        height: "100%",
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: accentColor
            ? `0 12px 32px ${accentColor}0.08)`
            : "0 12px 32px rgba(0,0,0,0.06)",
          transform: "translateY(-3px)",
          borderColor: danger
            ? "rgba(239,68,68,0.4)"
            : amber
            ? "rgba(245,158,11,0.4)"
            : "transparent",
        },
      }}
    >
      <CardContent sx={{ p: 3.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack spacing={2.5} sx={{ flex: 1 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: iconBg,
              color: iconColor,
            }}
          >
            {icon}
          </Box>

          <Stack spacing={0.75} sx={{ mt: "auto" }}>
            <Typography
              variant="caption"
              sx={{
                color: danger ? "error.main" : amber ? "#d97706" : "text.disabled",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                fontSize: "0.65rem",
              }}
            >
              {label}
            </Typography>
            <Typography
              fontWeight={800}
              sx={{
                fontSize: "1.75rem",
                lineHeight: 1.15,
                letterSpacing: -0.3,
                color: danger ? "error.main" : amber ? "#d97706" : "text.primary",
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  mt: 0.25,
                  color: danger ? "error.light" : amber ? "#b45309" : "text.secondary",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ActionRow({ icon, iconBg, iconColor, title, description, onClick }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2.5}
      onClick={onClick}
      sx={{
        px: 3.5,
        py: 2.5,
        cursor: "pointer",
        transition: "background-color 0.15s ease",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: iconBg,
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body1" fontWeight={650} sx={{ fontSize: "0.95rem" }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.8rem" }}>
          {description}
        </Typography>
      </Stack>

      <ChevronRightIcon sx={{ color: "text.disabled", fontSize: 22, flexShrink: 0 }} />
    </Stack>
  );
}
