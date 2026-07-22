import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import UpgradeDialog from "./UpgradeDialog";
import { getSubscription, upgradeToPro } from "../../services/subscriptionService";

export default function SubscriptionCard({ subscription: subscriptionProp, onSubscriptionChanged }) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [subscription, setSubscription] = useState(subscriptionProp);
  const [loading, setLoading] = useState(!subscriptionProp);

  useEffect(() => {
    if (subscriptionProp) {
      setSubscription(subscriptionProp);
      setLoading(false);
      return;
    }
    loadSubscription();
  }, [subscriptionProp]);

  async function loadSubscription() {
    setLoading(true);
    try {
      const data = await getSubscription();
      setSubscription(data);
    } finally {
      setLoading(false);
    }
  }


  const features = [
    "Dashboard & Analytics",
    "Livestock Management",
    "Crop Management",
    "Machinery Management",
    "Reports Centre",
  ];

  const handleOpenUpgrade = () => {
    setUpgradeOpen(true);
  };

  const handleCloseUpgrade = () => {
    setUpgradeOpen(false);
  };

  const handleUpgrade = async () => {
    try {
      await upgradeToPro();
      const updated = await getSubscription();
      setSubscription(updated);
      if (onSubscriptionChanged) onSubscriptionChanged();
    } catch (err) {
      console.error(err);
    } finally {
      setUpgradeOpen(false);
    }
  };

  const plan = subscription?.plan || "Starter";
  const isPro = String(plan).toLowerCase() === "pro";

  return (
    <>
      <Card
        elevation={2}
        sx={{
          height: "100%",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <WorkspacePremiumIcon color="warning" />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Subscription
              </Typography>
            </Stack>

            <Chip
              label={plan}
              color="success"
            />
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Current Plan
          </Typography>

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            {isPro ? "Pro Plan" : "Starter Plan"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Account Usage
          </Typography>

          <LinearProgress
            variant="determinate"
            value={35}
            sx={{
              height: 10,
              borderRadius: 5,
              mt: 1,
              mb: 3,
            }}
          />

          <Divider sx={{ mb: 3 }} />

          <Typography
            fontWeight={700}
            mb={2}
          >
            Included Features
          </Typography>

          <Stack spacing={1.5}>
            {features.map((feature) => (
              <Stack
                key={feature}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <CheckCircleIcon
                  color="success"
                  fontSize="small"
                />

                <Typography variant="body2">
                  {feature}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            color="warning"
            startIcon={<AutoAwesomeIcon />}
            fullWidth
            size="large"
            onClick={handleOpenUpgrade}
            disabled={isPro}
          >
            {isPro ? "PRO Active" : "Upgrade to Pro"}
          </Button>
        </CardContent>
      </Card>

      <UpgradeDialog
        open={upgradeOpen}
        onClose={handleCloseUpgrade}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}
