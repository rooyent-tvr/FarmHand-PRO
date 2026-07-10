import {
  FaHeartbeat,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaBaby,
} from "react-icons/fa";

export default function BreedingOverview({
  records = [],
}) {
  const today = new Date();

  const pregnant = records.filter(
    (record) => record.status === "Pregnant"
  );

  const dueSoon = pregnant.filter((record) => {
    if (!record.expected_birth_date) return false;

    const dueDate = new Date(record.expected_birth_date);
    const days =
      (dueDate - today) / (1000 * 60 * 60 * 24);

    return days >= 0 && days <= 30;
  });

  const overdue = pregnant.filter((record) => {
    if (!record.expected_birth_date) return false;

    return (
      new Date(record.expected_birth_date) < today
    );
  });

  const completed = records.filter(
    (record) =>
      record.status === "Completed"
  );

  const cards = [
    {
      title: "Pregnant",
      value: pregnant.length,
      color: "#2563EB",
      icon: <FaHeartbeat />,
    },
    {
      title: "Due Within 30 Days",
      value: dueSoon.length,
      color: "#F59E0B",
      icon: <FaCalendarAlt />,
    },
    {
      title: "Overdue",
      value: overdue.length,
      color: "#DC2626",
      icon: <FaExclamationTriangle />,
    },
    {
      title: "Completed",
      value: completed.length,
      color: "#16A34A",
      icon: <FaBaby />,
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
        🤰 Breeding Overview
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
