import { useEffect, useMemo, useState } from "react";

import { Grid, Stack } from "@mui/material";

import PageContainer from "../components/layout/PageContainer";
import HealthStats from "../components/health/HealthStats";
import AnimalHealthScore from "../components/health/AnimalHealthScore";
import AnimalHealthInsights from "../components/health/AnimalHealthInsights";
import UpcomingHealthTimeline from "../components/health/UpcomingHealthTimeline";
import HealthForm from "../components/health/HealthForm";
import HealthTable from "../components/health/HealthTable";

import { getHealthRecords } from "../services/healthService";
import { getAnimals } from "../services/livestockService";
import { generateAnimalHealthAnalytics } from "../utils/animalHealthAnalytics";

export default function Health() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadRecords() {
    try {
      const [healthData, animalData] = await Promise.all([
        getHealthRecords(),
        getAnimals().catch(() => []),
      ]);
      setRecords(healthData || []);
      setAnimals(animalData || []);
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
    () => generateAnimalHealthAnalytics({ healthRecords: records, animals }),
    [records, animals]
  );

  if (loading) {
    return (
      <PageContainer
        title="❤️ Animal Health"
        subtitle="Loading health records..."
      >
        Loading...
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="❤️ Animal Health"
      subtitle="Record vaccinations, treatments, medication and veterinary visits."
    >
      <Stack spacing={3}>
        <HealthStats records={records} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <AnimalHealthScore analytics={analytics} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <AnimalHealthInsights analytics={analytics} />
          </Grid>
        </Grid>

        <UpcomingHealthTimeline
          healthRecords={records}
          onAddRecord={() => window.scrollTo({ top: document.querySelector("#health-form")?.offsetTop - 80 || 600, behavior: "smooth" })}
        />

        <div id="health-form">
          <HealthForm
            record={selectedRecord}
            refreshRecords={loadRecords}
            onSaved={() => setSelectedRecord(null)}
          />
        </div>

        <HealthTable
          records={records}
          refreshRecords={loadRecords}
          onEdit={setSelectedRecord}
        />
      </Stack>
    </PageContainer>
  );
}
