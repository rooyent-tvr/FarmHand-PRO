import { useState } from "react";
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

export default function SubscriptionCard() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

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

  const handleUpgrade = () => {
    // TODO:
    // Integrate your payment provider here
    // (PayFast, Stripe, Peach Payments, etc.)

    console.log("Upgrade to PRO clicked");

    setUpgradeOpen(false);
  };

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
              label="Starter"
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
            Starter Plan
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
          >
            Upgrade to Pro
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
