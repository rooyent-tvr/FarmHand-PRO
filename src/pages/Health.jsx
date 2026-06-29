import { useEffect, useState } from "react";

import HealthForm from "../components/health/HealthForm";
import HealthTable from "../components/health/HealthTable";

import { getHealthRecords } from "../services/healthService";

export default function Health() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadRecords() {
    try {
      const data = await getHealthRecords();
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
    return <h2>Loading animal health records...</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 10 }}>❤️ Animal Health</h1>

      <p
        style={{
          color: "#666",
          marginBottom: 25,
        }}
      >
        Record vaccinations, treatments, medication and veterinary visits.
      </p>

      <HealthForm
        record={selectedRecord}
        refreshRecords={loadRecords}
        onSaved={() => setSelectedRecord(null)}
      />

      <HealthTable
        records={records}
        refreshRecords={loadRecords}
        onEdit={setSelectedRecord}
      />
    </div>
  );
}
