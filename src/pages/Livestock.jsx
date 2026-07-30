import { useEffect, useMemo, useState } from "react";

import { Grid, Stack } from "@mui/material";

import PageContainer from "../components/layout/PageContainer";
import LivestockStatsGrid from "../components/livestock/LivestockStatsGrid";
import LivestockHealthScore from "../components/livestock/LivestockHealthScore";
import LivestockInsights from "../components/livestock/LivestockInsights";
import AnimalForm from "../components/livestock/AnimalForm";
import AnimalModal from "../components/livestock/AnimalModal";
import ViewToggle from "../components/livestock/ViewToggle";
import LivestockView from "../components/livestock/LivestockView";

import { getAnimals } from "../services/livestockService";
import { getHealthRecords } from "../services/healthService";
import { getBreedingRecords } from "../services/breedingService";
import { generateLivestockAnalytics } from "../utils/livestockAnalytics";

export default function Livestock() {
  const [animals, setAnimals] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("table");

  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  async function loadAnimals() {
    setLoading(true);

    try {
      const [data, health, breeding] = await Promise.all([
        getAnimals(),
        getHealthRecords().catch(() => []),
        getBreedingRecords().catch(() => []),
      ]);
      setAnimals(data || []);
      setHealthRecords(health || []);
      setBreedingRecords(breeding || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnimals();
  }, []);

  // Single analytics computation — consumed by ALL widgets
  const analytics = useMemo(
    () => generateLivestockAnalytics({ animals, healthRecords, breedingRecords }),
    [animals, healthRecords, breedingRecords]
  );

  function handleEdit(animal) {
    setSelectedAnimal(animal);
    setShowModal(true);
  }

  function closeModal() {
    setSelectedAnimal(null);
    setShowModal(false);
  }

  return (
    <PageContainer
      title="🐄 Livestock Management"
      subtitle="Manage all livestock on your farm."
    >
      <Stack spacing={3}>
        <LivestockStatsGrid analytics={analytics} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <LivestockHealthScore analytics={analytics} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <LivestockInsights analytics={analytics} />
          </Grid>
        </Grid>

        <AnimalForm refreshAnimals={loadAnimals} />

        <ViewToggle
          view={view}
          setView={setView}
        />

        {loading ? (
          <p>Loading livestock...</p>
        ) : (
          <LivestockView
            view={view}
            animals={animals}
            onEdit={handleEdit}
            refreshAnimals={loadAnimals}
          />
        )}
      </Stack>

      <AnimalModal
        open={showModal}
        title="Edit Animal"
        onClose={closeModal}
      >
        <AnimalForm
          animal={selectedAnimal}
          refreshAnimals={loadAnimals}
          onSaved={closeModal}
        />
      </AnimalModal>
    </PageContainer>
  );
}
