import { useEffect, useMemo, useState } from "react";

import { Grid, Stack } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AddIcon from "@mui/icons-material/Add";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import HealingIcon from "@mui/icons-material/Healing";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

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
  const [showForm, setShowForm] = useState(false);
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

  // Derived KPI values from records
  const vaccinations = records.filter((r) => r.treatment_type === "Vaccination").length;
  const treatments = records.filter((r) => r.treatment_type === "Treatment" || r.treatment_type === "Medication").length;
  const dueSoon = records.filter((r) => {
    if (!r.next_due) return false;
    const diff = Math.ceil((new Date(r.next_due) - new Date()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).length;

  if (loading) {
    return (
      <PremiumPageLayout
        title="Animal Health"
        subtitle="Monitor vaccinations, treatments and herd health from one place."
        icon={<LocalHospitalIcon sx={{ fontSize: 28 }} />}
      >
        <PremiumLoadingState message="Loading health records..." size={40} />
      </PremiumPageLayout>
    );
  }

  return (
    <PremiumPageLayout
      title="Animal Health"
      subtitle="Monitor vaccinations, treatments and herd health from one place."
      icon={<LocalHospitalIcon sx={{ fontSize: 28 }} />}
    >
      <Stack spacing={4}>
        {/* KPI Cards */}
        <PremiumKPIGrid>
          <PremiumStatCard
            label="Total Records"
            value={records.length}
            subtitle="Health records"
            icon={<LocalHospitalIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(211,47,47,0.12)"
            iconColor="#D32F2F"
          />
          <PremiumStatCard
            label="Vaccinations"
            value={vaccinations}
            subtitle="Recorded"
            icon={<VaccinesIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(46,125,50,0.12)"
            iconColor="#2E7D32"
          />
          <PremiumStatCard
            label="Treatments"
            value={treatments}
            subtitle="Active & completed"
            icon={<MedicalServicesIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(106,27,154,0.12)"
            iconColor="#6A1B9A"
          />
          <PremiumStatCard
            label="Due This Week"
            value={dueSoon}
            subtitle="Upcoming"
            icon={<WarningAmberIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(239,108,0,0.12)"
            iconColor="#EF6C00"
          />
        </PremiumKPIGrid>

        {/* Health Intelligence */}
        <PremiumDashboardSection
          title="Health Intelligence"
          description="AI-powered monitoring and recommendations for your herd."
        >
          <Grid container spacing={spacing.cardGap}>
            <Grid size={{ xs: 12, md: 4 }}>
              <AnimalHealthScore analytics={analytics} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <AnimalHealthInsights analytics={analytics} />
            </Grid>
          </Grid>
        </PremiumDashboardSection>

        {/* Upcoming Timeline */}
        <UpcomingHealthTimeline
          healthRecords={records}
          onAddRecord={() => setShowForm(true)}
        />

        {/* Health Form */}
        {showForm && (
          <div id="health-form">
            <HealthForm
              record={selectedRecord}
              refreshRecords={loadRecords}
              onSaved={() => { setSelectedRecord(null); setShowForm(false); }}
            />
          </div>
        )}

        {/* Health Records */}
        <PremiumDashboardSection
          title="Health Records"
          description={`${records.length} health record${records.length !== 1 ? "s" : ""} in your registry.`}
        >
          <PremiumWorkspaceToolbar
            primaryAction={
              <PremiumActionButton
                label="Add Health Record"
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => setShowForm((prev) => !prev)}
              />
            }
          />
          <HealthTable
            records={records}
            refreshRecords={loadRecords}
            onEdit={(record) => { setSelectedRecord(record); setShowForm(true); }}
          />
        </PremiumDashboardSection>
      </Stack>
    </PremiumPageLayout>
  );
}
