import { useState } from "react";

import {
  Lock,
  Star,
  CheckCircle,
  RocketLaunch,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import UpgradeDialog from "../account/UpgradeDialog";

const FEATURE_TITLES = {
  ai: "AI Farm Intelligence",
  farm_intelligence: "Farm Intelligence",
  predictive_analytics: "Predictive Analytics",
  automation: "Farm Automation",
  advanced_reports: "Advanced Reports",
  weekly_summary: "Weekly Farm Summary",
  priority_support: "Priority Support",
};

export default function UpgradeRequired({ feature }) {
  const [open, setOpen] = useState(false);

  const title = FEATURE_TITLES[feature] || "Premium Feature";

  const features = [
    "AI Intelligence",
    "Predictive Analytics",
    "Automation",
    "Advanced Reports",
    "Priority Support",
  ];

  return (
    <>
      <Card
        elevation={1}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "success.light",
          overflow: "hidden",
          transition: "all .2s ease",
          "&:hover": {
            boxShadow: 4,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor: "success.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Lock
                    sx={{
                      fontSize: 30,
                      color: "success.dark",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    {title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    AI-powered decision support for modern farming
                  </Typography>
                </Box>
              </Stack>

              <Chip
                icon={<Star />}
                label="PRO"
                color="success"
                sx={{
                  fontWeight: 700,
                }}
              />
            </Stack>

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Upgrade to Feldrix PRO and unlock intelligent farm
              management tools designed to help you make faster,
              smarter decisions every day.
            </Typography>

            {/* Features */}
            <Stack
              direction="row"
              spacing={3}
              flexWrap="wrap"
              useFlexGap
            >
              {features.map((item) => (
                <Stack
                  key={item}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <CheckCircle
                    color="success"
                    fontSize="small"
                  />

                  <Typography variant="body2">
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Footer */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
              spacing={2}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Unlock every premium feature with a single PRO
                subscription.
              </Typography>

              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<RocketLaunch />}
                onClick={() => setOpen(true)}
                sx={{
                  borderRadius: 3,
                  minWidth: 220,
                  py: 1.2,
                  px: 4,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                Upgrade to PRO
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <UpgradeDialog
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
