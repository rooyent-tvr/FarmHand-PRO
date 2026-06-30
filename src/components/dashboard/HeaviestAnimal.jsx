import StatCard from "../ui/StatCard";

export default function HeaviestAnimal({ animals = [] }) {
  if (animals.length === 0) {
    return (
      <StatCard
        title="Heaviest Animal"
        value="-"
        icon="🏆"
        color="#F59E0B"
      />
    );
  }

  const heaviest = animals.reduce((current, animal) =>
    Number(current.weight || 0) > Number(animal.weight || 0)
      ? current
      : animal
  );

  return (
    <StatCard
      title="Heaviest Animal"
      value={`${heaviest.weight || 0} kg`}
      icon="🏆"
      color="#F59E0B"
    >
      <div
        style={{
          marginTop: 12,
          fontSize: 14,
          color: "#64748B",
          lineHeight: 1.6,
        }}
      >
        <div>
          <strong>Tag:</strong> {heaviest.tag}
        </div>

        <div>
          <strong>Breed:</strong> {heaviest.breed}
        </div>

        <div>
          <strong>Type:</strong> {heaviest.animal_type}
        </div>

        <div>
          <strong>Status:</strong> {heaviest.status}
        </div>
      </div>
    </StatCard>
  );
}
