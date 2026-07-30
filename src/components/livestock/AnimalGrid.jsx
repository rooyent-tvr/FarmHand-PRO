import { Box } from "@mui/material";
import { PremiumEmptyState } from "../../design";
import AnimalCard from "./AnimalCard";

export default function AnimalGrid({ animals = [], onEdit, onDelete }) {
  if (!animals.length) {
    return (
      <PremiumEmptyState
        title="No Animals Found"
        message="Add your first animal to start building your herd registry."
      />
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 3,
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
    </Box>
  );
}
