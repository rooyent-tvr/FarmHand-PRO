import { useEffect, useMemo, useState } from "react";

import { Grid, Stack } from "@mui/material";

import PageContainer from "../components/layout/PageContainer";

import BreedingStats from "../components/breeding/BreedingStats";
import BreedingPerformanceScore from "../components/breeding/BreedingPerformanceScore";
import BreedingInsights from "../components/breeding/BreedingInsights";
import UpcomingBreedingTimeline from "../components/breeding/UpcomingBreedingTimeline";
import UpcomingBirths from "../components/breeding/UpcomingBirths";
import OverdueBirths from "../components/breeding/OverdueBirths";
import BreedingForm from "../components/breeding/BreedingForm";
import BreedingTable from "../components/breeding/BreedingTable";

import { getBreedingRecords } from "../services/breedingService";
import { generateBreedingAnalytics } from "../utils/breedingAnalytics";

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

  // Single analytics computation
  const analytics = useMemo(
    () => generateBreedingAnalytics({ breedingRecords: records }),
    [records]
  );

  if (loading) {
    return (
      <PageContainer
        title="🐂 Breeding Management"
        subtitle="Loading breeding records..."
      >
        Loading...
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="🐂 Breeding Management"
      subtitle="Manage breeding records, pregnancies and expected births."
    >
      <Stack spacing={3}>
        <BreedingStats records={records} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <BreedingPerformanceScore analytics={analytics} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <BreedingInsights analytics={analytics} />
          </Grid>
        </Grid>

        <UpcomingBreedingTimeline
          timeline={analytics.timeline || []}
          onAddRecord={() => window.scrollTo({ top: document.querySelector("#breeding-form")?.offsetTop - 80 || 600, behavior: "smooth" })}
        />

        <UpcomingBirths records={records} />

        <OverdueBirths records={records} />

        <div id="breeding-form">
          <BreedingForm
            record={selectedRecord}
            refreshRecords={loadRecords}
            onSaved={() => setSelectedRecord(null)}
          />
        </div>

        <BreedingTable
          records={records}
          refreshRecords={loadRecords}
          onEdit={setSelectedRecord}
        />
      </Stack>
    </PageContainer>
  );
}
