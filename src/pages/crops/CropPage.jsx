import { useEffect, useMemo, useState } from "react";

import { Grid, Stack } from "@mui/material";
import GrassIcon from "@mui/icons-material/Grass";
import AddIcon from "@mui/icons-material/Add";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import LandscapeIcon from "@mui/icons-material/Landscape";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  PremiumPageLayout,
  PremiumKPIGrid,
  PremiumStatCard,
  PremiumDashboardSection,
  PremiumActionButton,
  PremiumWorkspaceToolbar,
  PremiumLoadingState,
  spacing,
} from "../../design";

import CropForm from "../../components/crops/CropForm";
import CropTable from "../../components/crops/CropTable";
import CropHealthScore from "../../components/crops/CropHealthScore";
import CropInsights from "../../components/crops/CropInsights";
import ViewToggle from "../../components/livestock/ViewToggle";

import { getCrops } from "../../services/cropService";
import { getWeatherSummary } from "../../services/weatherService";
import { generateCropAnalytics } from "../../utils/cropAnalytics";

export default function CropPage() {
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState("table");

  async function loadCrops() {
    setLoading(true);
    try {
      const [data, weatherData] = await Promise.all([
        getCrops(),
        getWeatherSummary().catch(() => null),
      ]);
      setCrops(data || []);
      setWeather(weatherData);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCrops();
  }, []);

  const analytics = useMemo(
    () => generateCropAnalytics({ crops, weather }),
    [crops, weather]
  );

  const totalCrops = crops.length;
  const growing = crops.filter((c) => c.status === "Growing").length;
  const harvested = crops.filter((c) => c.status === "Harvested").length;
  const totalArea = crops.reduce((sum, c) => sum + Number(c.area || 0), 0);

  if (loading) {
    return (
      <PremiumPageLayout
        title="Crops"
        subtitle="Manage planting, crop health, harvesting and seasonal performance."
        icon={<GrassIcon sx={{ fontSize: 28 }} />}
      >
        <PremiumLoadingState message="Loading crop data..." size={40} />
      </PremiumPageLayout>
    );
  }

  return (
    <PremiumPageLayout
      title="Crops"
      subtitle="Manage planting, crop health, harvesting and seasonal performance."
      icon={<GrassIcon sx={{ fontSize: 28 }} />}
    >
      <Stack spacing={4}>
        {/* KPI Cards */}
        <PremiumKPIGrid gap={3.5}>
          <PremiumStatCard
            label="Total Crops"
            value={totalCrops}
            subtitle="Registered"
            icon={<GrassIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(46,125,50,0.12)"
            iconColor="#2E7D32"
          />
          <PremiumStatCard
            label="Growing"
            value={growing}
            subtitle="Active growth"
            icon={<GrassIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(67,160,71,0.12)"
            iconColor="#43A047"
          />
          <PremiumStatCard
            label="Harvested"
            value={harvested}
            subtitle="Completed"
            icon={<AgricultureIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(251,140,0,0.12)"
            iconColor="#FB8C00"
          />
          <PremiumStatCard
            label="Total Area"
            value={`${totalArea.toFixed(1)} ha`}
            subtitle="Under management"
            icon={<LandscapeIcon sx={{ fontSize: 28 }} />}
            iconBg="rgba(21,101,192,0.12)"
            iconColor="#1565C0"
          />
        </PremiumKPIGrid>

        {/* Crop Intelligence */}
        <PremiumDashboardSection
          title="Crop Intelligence"
          description="AI-powered crop monitoring and harvest recommendations."
        >
          <Grid container spacing={spacing.cardGap}>
            <Grid size={{ xs: 12, md: 4 }}>
              <CropHealthScore analytics={analytics} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <CropInsights analytics={analytics} />
            </Grid>
          </Grid>
        </PremiumDashboardSection>

        {/* Crop Form (toggle) */}
        {showForm && (
          <CropForm
            crop={selectedCrop}
            refreshCrops={loadCrops}
            onSaved={() => { setSelectedCrop(null); setShowForm(false); }}
          />
        )}

        {/* Crop Records */}
        <PremiumDashboardSection
          title="Crop Registry"
          description={`${totalCrops} crop${totalCrops !== 1 ? "s" : ""} in your registry.`}
        >
          <PremiumWorkspaceToolbar
            primaryAction={
              <PremiumActionButton
                label="Add Crop"
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => setShowForm((prev) => !prev)}
              />
            }
            viewToggle={<ViewToggle view={view} setView={setView} />}
          />
          <CropTable
            crops={crops}
            onEdit={(crop) => { setSelectedCrop(crop); setShowForm(true); }}
            refreshCrops={loadCrops}
          />
        </PremiumDashboardSection>
      </Stack>
    </PremiumPageLayout>
  );
}
