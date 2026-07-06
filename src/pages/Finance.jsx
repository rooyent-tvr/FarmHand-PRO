import { useEffect, useState } from "react";

import PageContainer from "../components/layout/PageContainer";

import FinanceStats from "../components/finance/FinanceStats";
import FinanceForm from "../components/finance/FinanceForm";
import FinanceTable from "../components/finance/FinanceTable";

import {
  getFinanceRecords,
} from "../services/financeService";

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
        title="💰 Finance"
        subtitle="Loading finance records..."
      >
        Loading...
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="💰 Finance"
      subtitle="Manage your farm income and expenses."
    >
      <FinanceStats
        records={records}
      />

      <FinanceForm
        record={selectedRecord}
        refreshRecords={loadRecords}
        onSaved={() =>
          setSelectedRecord(null)
        }
      />

      <FinanceTable
        records={records}
        refreshRecords={loadRecords}
        onEdit={setSelectedRecord}
      />
    </PageContainer>
  );
}
