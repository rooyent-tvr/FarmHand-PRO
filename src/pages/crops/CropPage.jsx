import { useEffect, useState } from "react";

import { Grid, Stack } from "@mui/material";

import PageContainer from "../../components/layout/PageContainer";
import StatCard from "../../components/ui/StatCard";

import CropForm from "../../components/crops/CropForm";
import CropTable from "../../components/crops/CropTable";
import CropHealthScore from "../../components/crops/CropHealthScore";
import CropInsights from "../../components/crops/CropInsights";

import { getCrops } from "../../services/cropService";
import { getWeatherSummary } from "../../services/weatherService";
import { generateCropAnalytics } from "../../utils/cropAnalytics";

export default function CropPage() {
  const [crops, setCrops] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);

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

  function handleEdit(crop) {
    setSelectedCrop(crop);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleSaved() {
    setSelectedCrop(null);
  }

  const totalCrops = crops.length;

  const growing = crops.filter(
    (crop) => crop.status === "Growing"
  ).length;

  const harvested = crops.filter(
    (crop) => crop.status === "Harvested"
  ).length;

  const totalArea = crops.reduce(
    (sum, crop) => sum + Number(crop.area || 0),
    0
  );

  const analytics = generateCropAnalytics({ crops, weather });

  return (
    <PageContainer
      fullWidth
      title="🌾 Crop Management"
      subtitle="Manage planting, tracking and harvest information."
    >
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Crops"
              value={totalCrops}
              icon="🌾"
              color="success.dark"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Growing"
              value={growing}
              icon="🌱"
              color="success.main"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Harvested"
              value={harvested}
              icon="🚜"
              color="warning.dark"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Area"
              value={`${totalArea.toFixed(2)} ha`}
              icon="📏"
              color="info.dark"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <CropHealthScore analytics={analytics} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <CropInsights analytics={analytics} />
          </Grid>
        </Grid>

        <CropForm
          crop={selectedCrop}
          refreshCrops={loadCrops}
          onSaved={handleSaved}
        />

        {loading ? (
          <p>Loading crops...</p>
        ) : (
          <CropTable
            crops={crops}
            onEdit={handleEdit}
            refreshCrops={loadCrops}
          />
        )}
      </Stack>
    </PageContainer>
  );
}
