import StatCard from "../ui/StatCard";

export default function LivestockStatsGrid({ animals = [] }) {
  const totalAnimals = animals.length;

  const healthyAnimals = animals.filter(
    (animal) => animal.status === "Healthy"
  ).length;

  const pregnantAnimals = animals.filter(
    (animal) => animal.status === "Pregnant"
  ).length;

  const averageWeight =
    totalAnimals > 0
      ? (
          animals.reduce(
            (sum, animal) => sum + Number(animal.weight || 0),
            0
          ) / totalAnimals
        ).toFixed(0)
      : 0;

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
