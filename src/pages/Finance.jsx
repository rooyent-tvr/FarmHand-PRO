import { useEffect, useState } from "react";

import { Stack } from "@mui/material";

import PageContainer from "../components/layout/PageContainer";

import FinanceStats from "../components/finance/FinanceStats";
import FinanceForm from "../components/finance/FinanceForm";
import FinanceTable from "../components/finance/FinanceTable";
import FinanceInsights from "../components/finance/FinanceInsights";
import FinancialHealthScore from "../components/finance/FinancialHealthScore";

import {
  getFinanceRecords,
} from "../services/financeService";

import { generateFinanceAnalytics } from "../utils/financeAnalytics";

export default function Finance() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] =
    useState(null);
  const [loading, setLoading] =
    useState(true);

  async function loadRecords() {
    try {
      const data =
        await getFinanceRecords();

      setRecords(data || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  if (loading) {
    return (
      <PageContainer
        fullWidth
        title="💰 Finance"
        subtitle="Loading finance records..."
      >
        Loading...
      </PageContainer>
    );
  }

  const analytics = generateFinanceAnalytics({ financeRecords: records });

  return (
    <PageContainer
      fullWidth
      title="💰 Finance"
      subtitle="Manage your farm income and expenses."
    >
      <Stack spacing={3}>
        <FinanceStats records={records} />
        <FinancialHealthScore analytics={analytics} />
        <FinanceInsights analytics={analytics} />
        <FinanceForm
          record={selectedRecord}
          refreshRecords={loadRecords}
          onSaved={() => setSelectedRecord(null)}
        />
        <FinanceTable
          records={records}
          refreshRecords={loadRecords}
          onEdit={setSelectedRecord}
        />
      </Stack>
    </PageContainer>
  );
}
