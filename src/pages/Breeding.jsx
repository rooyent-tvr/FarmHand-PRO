import { useEffect, useState } from "react";

import PageContainer from "../components/layout/PageContainer";

import BreedingStats from "../components/breeding/BreedingStats";
import BreedingForm from "../components/breeding/BreedingForm";
import BreedingTable from "../components/breeding/BreedingTable";

import { getBreedingRecords } from "../services/breedingService";

export default function Breeding() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadRecords() {
    try {
      const data = await getBreedingRecords();
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
    return <h2>Loading breeding records...</h2>;
  }

  return (
    <PageContainer
      title="🐂 Breeding Management"
      subtitle="Manage breeding records, pregnancies and expected births."
    >
      <BreedingStats records={records} />

      <BreedingForm
        record={selectedRecord}
        refreshRecords={loadRecords}
        onSaved={() => setSelectedRecord(null)}
      />

      <BreedingTable
        records={records}
        refreshRecords={loadRecords}
        onEdit={setSelectedRecord}
      />
    </PageContainer>
  );
}
