import { useEffect, useMemo, useState } from "react";

import { Grid, Stack } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import {
  PremiumPageLayout,
  PremiumKPIGrid,
  PremiumStatCard,
  PremiumDashboardSection,
  PremiumActionButton,
  PremiumWorkspaceToolbar,
  PremiumLoadingState,
  spacing,
} from "../design";

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
  const [showForm, setShowForm] = useState(false);
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
      <PremiumPageLayout
        title="Breeding"
        subtitle="Track pregnancies, breeding performance and upcoming births."
        icon={<FavoriteIcon sx={{ fontSize: 28 }} />}
      >
        <PremiumLoadingState message="Loading breeding records..." size={40} />
      </PremiumPageLayout>
    );
  }

  return (
    <PremiumPageLayout
      title="Breeding"
      subtitle="Track pregnancies, breeding performance and upcoming births."
      icon={<FavoriteIcon sx={{ fontSize: 28 }} />}
    >
      <Stack spacing={4}>
        {/* KPI Cards */}
        <PremiumKPIGrid gap={3.5}>
          <PremiumStatCard
            label="Active Pregnancies"
            value={analytics.pregnantAnimals}
            subtitle="Currently pregnant"
            icon={<PregnantWomanIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(46,125,50,0.12)"
            iconColor="#2E7D32"
          />
          <PremiumStatCard
            label="Expected Births"
            value={analytics.expectedBirths}
            subtitle="Within 30 days"
            icon={<ChildFriendlyIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(21,101,192,0.12)"
            iconColor="#1565C0"
          />
          <PremiumStatCard
            label="Births This Month"
            value={analytics.birthsThisMonth}
            subtitle="Completed"
            icon={<ChildFriendlyIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(251,140,0,0.12)"
            iconColor="#FB8C00"
          />
          <PremiumStatCard
            label="Success Rate"
            value={`${analytics.breedingSuccessRate}%`}
            subtitle="Conception rate"
            icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(106,27,154,0.12)"
            iconColor="#6A1B9A"
          />
        </PremiumKPIGrid>

        {/* Breeding Intelligence */}
        <PremiumDashboardSection
          title="Breeding Intelligence"
          description="AI-powered pregnancy monitoring and performance insights."
        >
          <Grid container spacing={spacing.cardGap}>
            <Grid size={{ xs: 12, md: 4 }}>
              <BreedingPerformanceScore analytics={analytics} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <BreedingInsights analytics={analytics} />
            </Grid>
          </Grid>
        </PremiumDashboardSection>

        {/* Upcoming Timeline */}
        <UpcomingBreedingTimeline
          timeline={analytics.timeline || []}
          onAddRecord={() => setShowForm(true)}
        />

        {/* Upcoming & Overdue Births */}
        <UpcomingBirths records={records} />
        <OverdueBirths records={records} />

        {/* Breeding Form (toggle) */}
        {showForm && (
          <BreedingForm
            record={selectedRecord}
            refreshRecords={loadRecords}
            onSaved={() => { setSelectedRecord(null); setShowForm(false); }}
          />
        )}

        {/* Breeding Records */}
        <PremiumDashboardSection
          title="Breeding Records"
          description={`${records.length} breeding record${records.length !== 1 ? "s" : ""} in your registry.`}
        >
          <PremiumWorkspaceToolbar
            primaryAction={
              <PremiumActionButton
                label="Add Breeding Record"
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => setShowForm((prev) => !prev)}
              />
            }
          />
          <BreedingTable
            records={records}
            refreshRecords={loadRecords}
            onEdit={(record) => { setSelectedRecord(record); setShowForm(true); }}
          />
        </PremiumDashboardSection>
      </Stack>
    </PremiumPageLayout>
  );
}
