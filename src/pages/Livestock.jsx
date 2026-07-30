import { useEffect, useMemo, useState } from "react";

import { Grid, Stack } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import ScaleIcon from "@mui/icons-material/Scale";

import {
  PremiumPageLayout,
  PremiumKPIGrid,
  PremiumStatCard,
  PremiumDashboardSection,
  PremiumActionButton,
  PremiumLoadingState,
  PremiumWorkspaceToolbar,
  spacing,
} from "../design";

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
  const [showForm, setShowForm] = useState(false);

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

  if (loading) {
    return (
      <PremiumPageLayout
        title="Livestock"
        subtitle="Manage your herd, monitor performance and access every animal profile."
        icon={<PetsIcon sx={{ fontSize: 28 }} />}
      >
        <PremiumLoadingState message="Loading livestock data..." size={40} />
      </PremiumPageLayout>
    );
  }

  return (
    <PremiumPageLayout
      title="Livestock"
      subtitle="Manage your herd, monitor performance and access every animal profile."
      icon={<PetsIcon sx={{ fontSize: 28 }} />}
    >
      <Stack spacing={4}>
        {/* KPI Cards */}
        <PremiumKPIGrid gap={3.5}>
          <PremiumStatCard
            label="Total Animals"
            value={analytics.totalAnimals}
            subtitle="In your herd"
            icon={<PetsIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(46,125,50,0.12)"
            iconColor="#2E7D32"
          />
          <PremiumStatCard
            label="Healthy"
            value={analytics.healthyAnimals}
            subtitle="Status: Healthy"
            icon={<FavoriteIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(67,160,71,0.12)"
            iconColor="#43A047"
          />
          <PremiumStatCard
            label="Pregnant"
            value={analytics.pregnantAnimals}
            subtitle="Active pregnancies"
            icon={<PregnantWomanIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(251,140,0,0.12)"
            iconColor="#FB8C00"
          />
          <PremiumStatCard
            label="Average Weight"
            value={`${analytics.averageWeight} kg`}
            subtitle="Herd average"
            icon={<ScaleIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(21,101,192,0.12)"
            iconColor="#1565C0"
          />
        </PremiumKPIGrid>

        {/* Intelligence Section */}
        <PremiumDashboardSection
          title="Herd Intelligence"
          description="AI-powered health monitoring and recommendations."
        >
          <Grid container spacing={spacing.cardGap}>
            <Grid size={{ xs: 12, md: 4 }}>
              <LivestockHealthScore analytics={analytics} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <LivestockInsights analytics={analytics} />
            </Grid>
          </Grid>
        </PremiumDashboardSection>

        {/* Add Animal Form */}
        {showForm && (
          <AnimalForm
            refreshAnimals={loadAnimals}
            onSaved={() => setShowForm(false)}
          />
        )}

        {/* Herd View */}
        <PremiumDashboardSection
          title="Herd Registry"
          description={`${animals.length} animals registered.`}
        >
          <PremiumWorkspaceToolbar
            primaryAction={
              <PremiumActionButton
                label="Add Animal"
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => setShowForm((prev) => !prev)}
              />
            }
            viewToggle={<ViewToggle view={view} setView={setView} />}
          />
          <LivestockView
            view={view}
            animals={animals}
            onEdit={handleEdit}
            refreshAnimals={loadAnimals}
          />
        </PremiumDashboardSection>
      </Stack>

      {/* Edit Modal */}
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
    </PremiumPageLayout>
  );
}
