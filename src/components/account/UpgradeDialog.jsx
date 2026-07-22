import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function UpgradeDialog({
  open,
  onClose,
  onUpgrade,
}) {
  const starterFeatures = [
    "Dashboard",
    "Livestock Management",
    "Crop Management",
    "Machinery Management",
    "Planner",
    "Finance",
    "Reports Centre",
  ];

  const proFeatures = [
    "Everything in Starter",
    "AI Farm Assistant",
    "Farm Intelligence Centre",
    "Predictive Analytics",
    "Smart Weather Intelligence",
    "Smart Automation",
    "Advanced Reports",
    "Weekly AI Farm Summary",
    "Priority Support",
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          spacing={1}
          alignItems="center"
        >
          <WorkspacePremiumIcon
            color="warning"
            sx={{ fontSize: 42 }}
          />

          <Typography
            variant="h4"
            fontWeight={800}
          >
            Upgrade to FarmHand PRO
          </Typography>

          <Typography
            color="text.secondary"
            textAlign="center"
          >
            Unlock AI-powered farming tools, predictive
            insights and advanced reporting.
          </Typography>

          <Typography
            variant="h3"
            color="success.main"
            fontWeight={800}
          >
            Only R99/month
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
              >
                <Chip
                  label="Starter"
                  color="success"
                />

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  Free
                </Typography>

                <Divider flexItem />

                <Stack spacing={1.5}>
                  {starterFeatures.map((feature) => (
                    <Stack
                      key={feature}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <CheckCircleIcon color="success" />

                      <Typography variant="body2">
                        {feature}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                border: "2px solid",
                borderColor: "warning.main",
                bgcolor: "warning.50",
                height: "100%",
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
              >
                <Chip
                  label="PRO"
                  color="warning"
                />

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  R99/month
                </Typography>

                <Divider flexItem />

                <Stack spacing={1.5}>
                  {proFeatures.map((feature) => (
                    <Stack
                      key={feature}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <CheckCircleIcon color="success" />

                      <Typography variant="body2">
                        {feature}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Maybe Later
        </Button>

        <Button
          variant="contained"
          color="warning"
          startIcon={<AutoAwesomeIcon />}
          onClick={onUpgrade}
        >
          Upgrade Now
        </Button>
      </DialogActions>
    </Dialog>
  );
}
