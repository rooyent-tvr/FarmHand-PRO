import AnimalGrid from "./AnimalGrid";
import AnimalTable from "./AnimalTable";

export default function LivestockView({
  view,
  animals,
  onEdit,
  refreshAnimals,
}) {
  if (view === "cards") {
    return (
      <AnimalGrid
        animals={animals}
        onEdit={onEdit}
        onDelete={refreshAnimals}
      />
    );
  }

  return (
    <AnimalTable
      animals={animals}
      onEdit={onEdit}
      refreshAnimals={refreshAnimals}
    />
  );
}
