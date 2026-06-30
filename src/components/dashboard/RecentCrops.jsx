export default function RecentCrops({ crops = [] }) {
  const recent = [...crops]
    .sort(
      (a, b) =>
        new Date(b.created_at || 0) -
        new Date(a.created_at || 0)
    )
    .slice(0, 5);

  function getStatusColor(status) {
    switch (status) {
      case "Growing":
        return "#43A047";

      case "Harvested":
        return "#1976D2";

      case "Planted":
        return "#FB8C00";

      default:
        return "#757575";
    }
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
        height: "100%",
      }}
    >
      {/* Header */}

      <div
        style={{
          marginBottom: 20,
          borderBottom: "1px solid #E5E7EB",
          paddingBottom: 14,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#0F172A",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          🌾 Recent Crops
        </h2>

        <p
          style={{
            marginTop: 6,
            color: "#64748B",
            fontSize: 14,
          }}
        >
          Recently created crop records.
        </p>
      </div>

      {recent.length === 0 ? (
        <div
          style={{
            padding: 50,
            textAlign: "center",
            color: "#94A3B8",
          }}
        >
          <div
            style={{
              fontSize: 42,
              marginBottom: 10,
            }}
          >
            🌾
          </div>

          <strong>No crop records available.</strong>

[O          <p
            style={{
              marginTop: 8,
              fontSize: 13,
            }}
          >
            Your latest crop records will appear here.
          </p>
        </div>
      ) : (
        recent.map((crop, index) => (
          <div
            key={crop.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px 0",
              borderBottom:
                index === recent.length - 1
                  ? "none"
                  : "1px solid #F1F5F9",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#0F172A",
                }}
              >
                🌾 {crop.crop_name}
              </div>

              <div
                style={{
                  color: "#64748B",
                  fontSize: 14,
                  marginTop: 4,
                }}
              >
                📍 {crop.field_name}
              </div>

              <div
                style={{
                  marginTop: 6,
                  color: "#94A3B8",
                  fontSize: 12,
                }}
              >
                {crop.area} {crop.area_unit}
              </div>
            </div>

            <span
              style={{
                background: getStatusColor(crop.status),
                color: "#FFFFFF",
                padding: "7px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                minWidth: 95,
                textAlign: "center",
              }}
            >
              {crop.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
