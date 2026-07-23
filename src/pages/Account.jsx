import { useEffect, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";

import { supabase } from "../supabaseClient";
import { getPaymentHistory } from "../services/billingService";

import ProfileCard from "../components/account/ProfileCard";
import FarmInformation from "../components/account/FarmInformation";
import PreferencesCard from "../components/account/PreferencesCard";
import SecurityCard from "../components/account/SecurityCard";
import StatisticsCard from "../components/account/StatisticsCard";
import SubscriptionCard from "../components/account/SubscriptionCard";
import BillingHistory from "../components/account/BillingHistory";
import QuickActionsCard from "../components/account/QuickActionsCard";

export default function Account() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setPayments([]);
        return;
      }

      const history = await getPaymentHistory(user.id);
      setPayments(history);
    } catch (error) {
      console.error("Failed to load payment history:", error);
      setPayments([]);
    }
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Account Centre
          </Typography>

          <Typography color="text.secondary">
            Manage your FarmHand PRO account.
          </Typography>
        </Box>

        <ProfileCard />

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
            <Stack spacing={3}>
              <BillingHistory payments={payments} />
              <QuickActionsCard />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
