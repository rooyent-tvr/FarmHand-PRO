import StatCard from "../ui/StatCard";

export default function FarmSummary({ dashboard }) {
  if (!dashboard) return null;

  const {
    totalAnimals,
    totalCrops,
    totalValue,
    totalArea,
  } = dashboard;

  return (
    <div style={{ marginBottom: 30 }}>
      <h2
        style={{
          marginBottom: 20,
          color: "#2E7D32",
        }}
      >
        🚜 Farm Summary
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20,
        }}
      >
        <StatCard
          title="Total Animals"
          value={totalAnimals}
          icon="🐄"
          color="#2E7D32"
        />

        <StatCard
          title="Total Crops"
          value={totalCrops}
          icon="🌾"
          color="#388E3C"
        />

        <StatCard
          title="Livestock Value"
          value={`R ${Number(totalValue).toLocaleString()}`}
          icon="💰"
          color="#F9A825"
        />

        <StatCard
          title="Farm Area"
          value={`${Number(totalArea).toFixed(2)} ha`}
          icon="📏"
          color="#1565C0"
        />
      </div>
    </div>
  );
}
