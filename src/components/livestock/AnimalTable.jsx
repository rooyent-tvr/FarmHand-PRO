import { useState } from "react";
import { deleteAnimal } from "../../services/livestockService";

export default function AnimalTable({
  animals,
  onEdit,
  refreshAnimals,
}) {
  const [search, setSearch] = useState("");

  const filtered = animals.filter((animal) => {
    const term = search.toLowerCase();

    return (
      animal.tag.toLowerCase().includes(term) ||
      (animal.animal_type || "Cattle").toLowerCase().includes(term) ||
      animal.breed.toLowerCase().includes(term) ||
      animal.gender.toLowerCase().includes(term) ||
      animal.status.toLowerCase().includes(term)
    );
  });

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this animal?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAnimal(id);
      await refreshAnimals();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "24px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Livestock</h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#777",
            }}
          >
            {filtered.length} Animals
          </p>
        </div>

        <input
          type="text"
          placeholder="🔍 Search by Tag, Breed, Species or Status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px 16px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #D0D7DE",
            fontSize: "14px",
          }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#2E7D32",
                color: "white",
              }}
            >
              <th style={header}>Tag</th>
              <th style={header}>Species</th>
              <th style={header}>Breed</th>
              <th style={header}>Gender</th>
              <th style={header}>Weight</th>
              <th style={header}>Status</th>
              <th style={header}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((animal, index) => (
              <tr
                key={animal.id}
                style={{
                  borderBottom: "1px solid #eee",
                  background: index % 2 ? "#FCFCFC" : "#FFF",
                }}
              >
                <td style={cell}>{animal.tag}</td>

                <td style={cell}>
                  {getSpeciesIcon(animal.animal_type)}{" "}
                  {animal.animal_type || "Cattle"}
                </td>

                <td style={cell}>{animal.breed}</td>

                <td style={cell}>{animal.gender}</td>

                <td style={cell}>
                  {animal.weight ? `${animal.weight} kg` : "-"}
                </td>

                <td style={cell}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontWeight: 600,
                      fontSize: 13,
                      color: "#fff",
                      background:
                        animal.status === "Healthy"
                          ? "#2E7D32"
                          : animal.status === "Pregnant"
                          ? "#FB8C00"
                          : "#D32F2F",
                    }}
                  >
                    {animal.status}
                  </span>
                </td>

                <td style={cell}>
                  <button
                    style={editButton}
                    onClick={() => onEdit(animal)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    style={deleteButton}
                    onClick={() => handleDelete(animal.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const header = {
  padding: "14px",
  textAlign: "left",
};

const cell = {
  padding: "14px",
};

const editButton = {
  background: "#1976D2",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  padding: "8px 14px",
  cursor: "pointer",
  marginRight: "8px",
  fontWeight: 600,
};

const deleteButton = {
  background: "#D32F2F",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  padding: "8px 14px",
  cursor: "pointer",
  fontWeight: 600,
};

function getSpeciesIcon(animal_type) {
  switch (animal_type) {
    case "Sheep":
      return "🐑";
    case "Goats":
      return "🐐";
    case "Pigs":
      return "🐖";
    case "Poultry":
      return "🐔";
    default:
      return "🐄";
  }
}


