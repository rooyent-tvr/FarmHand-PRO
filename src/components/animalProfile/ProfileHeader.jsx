export default function ProfileHeader({ animal }) {
  if (!animal) return null;

  const statusColor = {
    Healthy: "#16A34A",
    Pregnant: "#F59E0B",
    Sick: "#DC2626",
    Sold: "#64748B",
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
        background: "linear-gradient(135deg,#2E7D32,#43A047)",
        color: "#FFFFFF",
        borderRadius: 20,
        padding: 30,
        marginBottom: 24,
        boxShadow: "0 12px 30px rgba(15,23,42,.18)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 70,
            }}
          >
            {speciesIcon[animal.animal_type] || "🐄"}
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 34,
              }}
            >
              {animal.tag}
            </h1>

            <p
              style={{
                marginTop: 8,
                opacity: .95,
                fontSize: 18,
              }}
            >
              {animal.breed}
            </p>
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background:
                statusColor[animal.status] || "#64748B",
              padding: "10px 18px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            {animal.status}
          </div>

          <div
            style={{
              marginTop: 16,
              fontSize: 15,
            }}
          >
            Purchased

            <br />

            <strong>
              {animal.purchase_date || "-"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
