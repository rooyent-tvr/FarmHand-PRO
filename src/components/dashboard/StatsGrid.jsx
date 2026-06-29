import StatCard from "../cards/StatCard";

export default function StatsGrid({ animals }) {
  const total = animals.length;

  const healthy = animals.filter(
    (a) => a.status === "Healthy"
  ).length;

  const pregnant = animals.filter(
    (a) => a.status === "Pregnant"
  ).length;

  const totalWeight = animals.reduce(
    (sum, animal) => sum + (Number(animal.weight) || 0),
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
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      <StatCard
        title="Total Animals"
        value={total}
        icon="🐄"
      />

      <StatCard
        title="Healthy"
        value={healthy}
        icon="❤️"
      />

      <StatCard
        title="Pregnant"
        value={pregnant}
        icon="🤰"
      />

      <StatCard
        title="Average Weight"
        value={`${averageWeight} kg`}
        icon="⚖️"
      />
    </div>
  );
}
