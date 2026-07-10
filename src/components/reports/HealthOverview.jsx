import {
  FaHeartbeat,
  FaStethoscope,
  FaSyringe,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function HealthOverview({
  records = [],
}) {
  const healthy = records.filter(
    (record) =>
      record.health_status === "Healthy" ||
      record.status === "Healthy"
  ).length;

  const treatment = records.filter(
    (record) =>
      record.health_status === "Under Treatment" ||
      record.status === "Under Treatment"
  ).length;

  const vaccinated = records.filter(
    (record) =>
      record.treatment_type === "Vaccination" ||
      record.record_type === "Vaccination"
  ).length;

  const critical = records.filter(
    (record) =>
      record.health_status === "Critical" ||
      record.status === "Critical"
  ).length;

  const cards = [
    {
      title: "Healthy",
      value: healthy,
      color: "#16A34A",
      icon: <FaHeartbeat />,
    },
    {
      title: "Under Treatment",
      value: treatment,
      color: "#F59E0B",
      icon: <FaStethoscope />,
    },
    {
      title: "Vaccinations",
      value: vaccinated,
      color: "#2563EB",
      icon: <FaSyringe />,
    },
    {
      title: "Critical Cases",
      value: critical,
      color: "#DC2626",
      icon: <FaExclamationTriangle />,
    },
  ];

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        marginTop: 30,
        boxShadow:
          "0 8px 20px rgba(15,23,42,.08)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 24,
        }}
      >
        ❤️ Health Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              borderLeft: `5px solid ${card.color}`,
              background: "#F8FAFC",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: card.color,
              }}
            >
              {card.icon}
            </div>

            <div
              style={{
                marginTop: 10,
                color: "#64748B",
                fontSize: 14,
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
