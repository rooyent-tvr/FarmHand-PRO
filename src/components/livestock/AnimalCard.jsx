import { useNavigate } from "react-router-dom";

export default function AnimalCard({
  animal,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  const statusColor = {
    Healthy: "#16A34A",
    Pregnant: "#F59E0B",
    Sick: "#DC2626",
    Sold: "#6B7280",
  };

  const speciesIcon = {
    Cattle: "🐄",
    Sheep: "🐑",
    Goats: "🐐",
    Pigs: "🐖",
    Poultry: "🐔",
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 8px 20px rgba(15,23,42,.08)",
        border: "1px solid #E5E7EB",
        transition: "0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 34,
          }}
        >
          {speciesIcon[animal.animal_type] || "🐄"}
        </div>

        <span
          style={{
            background: statusColor[animal.status] || "#64748B",
            color: "#FFFFFF",
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {animal.status}
        </span>
      </div>

      <h3
        style={{
          margin: 0,
          color: "#0F172A",
        }}
      >
        {animal.tag}
      </h3>

      <p
        style={{
          margin: "6px 0 18px",
          color: "#64748B",
        }}
      >
        {animal.breed}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <Info
          label="Gender"
          value={animal.gender}
        />

        <Info
          label="Weight"
          value={
            animal.weight
              ? `${animal.weight} kg`
              : "-"
          }
        />

        <Info
          label="Species"
          value={animal.animal_type}
        />

        <Info
          label="Purchase"
          value={
            animal.purchase_price
              ? `R ${Number(
                  animal.purchase_price
                ).toLocaleString()}`
              : "-"
          }
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <button
          onClick={() => navigate(`/animals/${animal.id}`)}
          style={{
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: "#2E7D32",
            color: "#FFFFFF",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          👁 View Profile
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <button
          onClick={() => onEdit(animal)}
          style={{
            flex: 1,
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: "#2563EB",
            color: "#FFFFFF",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ✏ Edit
        </button>

        <button
          onClick={() => onDelete(animal.id)}
          style={{
            flex: 1,
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: "#DC2626",
            color: "#FFFFFF",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          color: "#94A3B8",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 4,
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {value}
      </div>
    </div>
  );
}
