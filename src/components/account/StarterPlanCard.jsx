import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const STARTER_FEATURES = [
  "Basic Dashboard",
  "Up to 20 Animals",
  "Up to 5 Crops",
  "Community Support",
];

const PRO_FEATURES = [
  "Unlimited Livestock",
  "Unlimited Crops",
  "Unlimited Machinery",
  "Unlimited Finance",
  "AI Farm Intelligence",
  "Predictive Analytics",
  "Farm Intelligence Centre",
  "Priority Support",
];

export default function StarterPlanCard({ onUpgrade }) {
  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Hero */}
      <Box
        sx={{
          p: 4,
          background: (theme) =>
            `linear-gradient(135deg,
            ${theme.palette.success.main},
            ${theme.palette.success.dark})`,
          color: "#fff",
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <WorkspacePremiumIcon sx={{ fontSize: 38 }} />

            <Chip
              label="Starter Plan"
              sx={{
                bgcolor: "rgba(255,255,255,0.18)",
                color: "#fff",
                fontWeight: 700,
              }}
            />
          </Stack>

          <Typography variant="h4" fontWeight={700}>
            Upgrade to PRO
          </Typography>

          <Typography sx={{ opacity: 0.9 }}>
            Unlock every premium feature in Feldrix and manage your farm
            without limits.
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
          >
            R99
            <Typography
              component="span"
              variant="h6"
              sx={{ ml: 1 }}
            >
              / month
            </Typography>
          </Typography>
        </Stack>
      </Box>

      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              gutterBottom
            >
              Your Current Starter Features
            </Typography>

            <Stack spacing={1}>
              {STARTER_FEATURES.map((feature) => (
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
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              gutterBottom
            >
              PRO Includes
            </Typography>

            <Stack spacing={1}>
              {PRO_FEATURES.map((feature) => (
                <Stack
                  key={feature}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <WorkspacePremiumIcon
                    color="warning"
                    fontSize="small"
                  />

                  <Typography variant="body2">
                    {feature}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Divider />

          <Button
            fullWidth
            size="large"
            variant="contained"
            color="warning"
            startIcon={<RocketLaunchIcon />}
            onClick={onUpgrade}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            Upgrade to PRO
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
