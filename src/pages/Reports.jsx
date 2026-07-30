import { useEffect, useState } from "react";

import { Box, Divider, Stack, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

import PageContainer from "../components/layout/PageContainer";

import ReportStats from "../components/reports/ReportStats";
import IncomeExpenseChart from "../components/reports/IncomeExpenseChart";
import LivestockChart from "../components/reports/LivestockChart";
import BreedingOverview from "../components/reports/BreedingOverview";
import HealthOverview from "../components/reports/HealthOverview";
import ExportCenter from "../components/reports/ExportCenter";

import BillingHistory from "../components/billing/BillingHistory";
import SubscriptionTimeline from "../components/billing/SubscriptionTimeline";

import { getFarmReport } from "../services/reportService";

export default function Reports() {
  const [report, setReport] = useState({
    totalAnimals: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    animals: [],
    finance: [],
    breeding: [],
    health: [],
  });

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    try {
      const data = await getFarmReport();
      setReport(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <PageContainer
      title="📊 Reports"
      subtitle="Farm Reports & Analytics"
    >
      <ReportStats />

      <IncomeExpenseChart
        income={report.totalIncome}
        expenses={report.totalExpenses}
      />

      <LivestockChart
        animals={report.animals}
      />

      <BreedingOverview
        records={report.breeding}
      />

      <HealthOverview
        records={report.health}
      />

      <ExportCenter
        report={report}
      />

      {/* ================================================================
          BILLING DOCUMENTS
          ================================================================ */}
      <Box sx={{ mt: 4 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          <DescriptionIcon sx={{ color: "#6366f1", fontSize: 28 }} />
          <Stack spacing={0}>
            <Typography variant="h5" fontWeight={700}>
              Billing Documents
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Invoices, receipts and subscription payment history
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <BillingHistory />
          <SubscriptionTimeline />
        </Stack>
      </Box>
    </PageContainer>
  );
}
