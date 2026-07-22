import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { hasFeature, upgradeToPro } from "../../services/subscriptionService";
import UpgradeDialog from "../account/UpgradeDialog";

export default function FeatureGate({
  feature,
  title = "PRO Feature",
  description = "Upgrade to FarmHand PRO to unlock this feature.",
  children,
  fallback = null,
}) {
  const [allowed, setAllowed] = useState(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkPermission() {
      try {
        const result = await hasFeature(feature);

        if (mounted) {
          setAllowed(result);
        }
      } catch (error) {
        console.error(error);

        if (mounted) {
          setAllowed(false);
        }
      }
    }

    checkPermission();

    return () => {
      mounted = false;
    };
  }, [feature]);

  if (allowed === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        py={5}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (allowed) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack
          spacing={2}
          alignItems="center"
        >
          <WorkspacePremiumIcon
            color="warning"
            sx={{ fontSize: 48 }}
          />

          <Typography
            variant="h5"
            fontWeight={700}
          >
            {title}
          </Typography>

          <Typography
            textAlign="center"
            color="text.secondary"
          >
            {description}
          </Typography>

          <Alert
            icon={<LockIcon />}
            severity="warning"
            sx={{ width: "100%" }}
          >
            Available with the PRO subscription.
          </Alert>

          <Button
            variant="contained"
            color="warning"
            onClick={() => setUpgradeOpen(true)}
          >
            Upgrade to PRO
          </Button>

          <UpgradeDialog
            open={upgradeOpen}
            onClose={() => setUpgradeOpen(false)}
            onUpgrade={async () => {
              try {
                await upgradeToPro();
                setAllowed(true);
              } catch (error) {
                console.error(error);
              } finally {
                setUpgradeOpen(false);
              }
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
