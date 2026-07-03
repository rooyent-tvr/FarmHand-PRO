import AnimalCard from "./AnimalCard";

export default function AnimalGrid({
  animals = [],
  onEdit,
  onDelete,
}) {
  if (!animals.length) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 18,
          padding: 60,
          textAlign: "center",
          color: "#64748B",
          border: "1px dashed #CBD5E1",
        }}
      >
        <div style={{ fontSize: 60 }}>
          🐄
        </div>

        <h2>No Animals Found</h2>

        <p>
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(340px,1fr))",
        gap: 24,
      }}
    >
      {animals.map((animal) => (
        <AnimalCard
          key={animal.id}
          animal={animal}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
