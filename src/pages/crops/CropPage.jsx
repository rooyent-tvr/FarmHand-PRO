import { useEffect, useState } from "react";

import PageContainer from "../../components/layout/PageContainer";
import StatCard from "../../components/ui/StatCard";

import CropForm from "../../components/crops/CropForm";
import CropTable from "../../components/crops/CropTable";

import { getCrops } from "../../services/cropService";

export default function CropPage() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);

  async function loadCrops() {
    setLoading(true);

    try {
      const data = await getCrops();
      setCrops(data || []);
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

  return (
    <PageContainer
      title="🌾 Crop Management"
      subtitle="Manage planting, tracking and harvest information."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <StatCard
          title="Total Crops"
          value={totalCrops}
          icon="🌾"
          color="#2E7D32"
        />

        <StatCard
          title="Growing"
          value={growing}
          icon="🌱"
          color="#43A047"
        />

        <StatCard
          title="Harvested"
          value={harvested}
          icon="🚜"
          color="#EF6C00"
        />

        <StatCard
          title="Total Area"
          value={`${totalArea.toFixed(2)} ha`}
          icon="📏"
          color="#1565C0"
        />
      </div>

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
    </PageContainer>
  );
}
