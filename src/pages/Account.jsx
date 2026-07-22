import { Box, Grid, Stack, Typography } from "@mui/material";

import ProfileCard from "../components/account/ProfileCard";
import FarmInformation from "../components/account/FarmInformation";
import PreferencesCard from "../components/account/PreferencesCard";
import SecurityCard from "../components/account/SecurityCard";
import StatisticsCard from "../components/account/StatisticsCard";
import SubscriptionCard from "../components/account/SubscriptionCard";
import QuickActionsCard from "../components/account/QuickActionsCard";

export default function Account() {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack spacing={3}>
        {/* Page Header */}
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
          >
            Account Centre
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage your FarmHand PRO account, farm profile, preferences,
            subscription and security settings.
          </Typography>
        </Box>

        {/* Profile Hero */}
        <ProfileCard />

        {/* Main Content */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <FarmInformation />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <PreferencesCard />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <SecurityCard />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <StatisticsCard />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <SubscriptionCard />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <QuickActionsCard />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
