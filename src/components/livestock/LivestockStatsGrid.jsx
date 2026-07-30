import StatCard from "../ui/StatCard";

/**
 * Livestock KPI cards.
 * Consumes the unified analytics object — no independent calculations.
 */
export default function LivestockStatsGrid({ analytics }) {
  const totalAnimals = analytics?.totalAnimals ?? 0;
  const healthyAnimals = analytics?.healthyAnimals ?? 0;
  const pregnantAnimals = analytics?.pregnantAnimals ?? 0;
  const averageWeight = analytics?.averageWeight ?? 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 20,
        marginBottom: 25,
      }}
    >
      <StatCard
        title="Total Animals"
        value={totalAnimals}
        icon="🐄"
        color="#2E7D32"
      />

      <StatCard
        title="Healthy"
        value={healthyAnimals}
        icon="❤️"
        color="#43A047"
      />

      <StatCard
        title="Pregnant"
        value={pregnantAnimals}
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
