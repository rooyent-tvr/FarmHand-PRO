import StatCard from "../ui/StatCard";

export default function StatsGrid({ animals = [] }) {
  const total = animals.length;

  const healthy = animals.filter(
    (animal) => animal.status === "Healthy"
  ).length;

  const pregnant = animals.filter(
    (animal) => animal.status === "Pregnant"
  ).length;

  const totalWeight = animals.reduce(
    (sum, animal) => sum + Number(animal.weight || 0),
    0
  );

  const averageWeight =
    total > 0
      ? Math.round(totalWeight / total)
      : 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(240px,1fr))",
        gap: "20px",
        marginBottom: "25px",
      }}
    >
      <StatCard
        title="Total Animals"
        value={total}
        icon="🐄"
        color="#2E7D32"
      />

      <StatCard
        title="Healthy"
        value={healthy}
        icon="❤️"
        color="#43A047"
      />

      <StatCard
        title="Pregnant"
        value={pregnant}
        icon="🤰"
        color="#FB8C00"
      />

      <StatCard
        title="Average Weight"
        value={`${averageWeight} kg`}
        icon="⚖️"
        color="#1565C0"
      />
    </div>
  );
}
