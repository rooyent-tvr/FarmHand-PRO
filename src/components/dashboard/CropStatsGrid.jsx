import StatCard from "../ui/StatCard";

export default function CropStatsGrid({ crops = [] }) {
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
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
        marginTop: 30,
        marginBottom: 30,
      }}
    >
      <StatCard
        title="Total Crops"
        value={totalCrops}
        icon="🌾"
      />

      <StatCard
        title="Growing"
        value={growing}
        icon="🌱"
        color="#2E7D32"
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
  );
}
