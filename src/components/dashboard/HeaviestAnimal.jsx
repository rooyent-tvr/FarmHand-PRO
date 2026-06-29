import StatCard from "./StatCard";

export default function HeaviestAnimal({ animals }) {
  if (!animals.length) {
    return (
      <StatCard
        title="Heaviest Animal"
        value="-"
        subtitle="No livestock"
        icon="🏆"
      />
    );
  }

  const heaviest = animals.reduce((a, b) =>
    Number(a.weight || 0) > Number(b.weight || 0) ? a : b
  );

  return (
    <StatCard
      title="Heaviest Animal"
      value={`${heaviest.weight} kg`}
      subtitle={`${heaviest.tag} • ${heaviest.breed}`}
      icon="🏆"
    />
  );
}
