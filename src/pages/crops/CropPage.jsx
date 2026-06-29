import { useEffect, useState } from "react";
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
    }

    setLoading(false);
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

  // Dashboard Statistics
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
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <h1
        style={{
          marginBottom: 10,
        }}
      >
        🌾 Crop Management
      </h1>

      <p
        style={{
          color: "#666",
          marginTop: 0,
          marginBottom: 30,
        }}
      >
        Manage planting, tracking and harvest information.
      </p>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <StatCard
          title="🌾 Total Crops"
          value={totalCrops}
        />

        <StatCard
          title="🌱 Growing"
          value={growing}
        />

        <StatCard
          title="🚜 Harvested"
          value={harvested}
        />

        <StatCard
          title="📏 Total Area"
          value={`${totalArea.toFixed(2)} ha`}
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
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <div
        style={{
          color: "#666",
          fontSize: 14,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: "700",
          color: "#2E7D32",
        }}
      >
        {value}
      </div>
    </div>
  );
}
