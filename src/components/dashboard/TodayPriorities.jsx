import Card from "../ui/Card";

export default function TodayPriorities({
  healthDue = 0,
  pregnant = 0,
  growing = 0,
  tasksDue = 0,
}) {
  const items = [
    {
      icon: "💉",
      title: "Health Treatments",
      value: healthDue,
      text:
        healthDue === 0
          ? "No treatments due."
          : `${healthDue} treatment${healthDue > 1 ? "s" : ""} due today.`,
      color: "#DC2626",
    },
    {
      icon: "🐂",
      title: "Pregnancies",
      value: pregnant,
      text:
        pregnant === 0
          ? "No active pregnancies."
          : `${pregnant} active pregnanc${pregnant === 1 ? "y" : "ies"}.`,
      color: "#F59E0B",
    },
    {
      icon: "🌱",
      title: "Growing Crops",
      value: growing,
      text:
        growing === 0
          ? "No crops currently growing."
          : `${growing} crop${growing > 1 ? "s are" : " is"} growing.`,
      color: "#16A34A",
    },
    {
      icon: "📋",
      title: "Outstanding Tasks",
      value: tasksDue,
      text:
        tasksDue === 0
          ? "No overdue tasks."
          : `${tasksDue} task${tasksDue > 1 ? "s" : ""} require attention.`,
      color: "#2563EB",
    },
  ];

  return (
    <Card
      title="⚠ Today's Priorities"
      subtitle="Items that need your attention today."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 18,
        }}
      >
        {items.map((item) => (
          <div
            key={item.title}
            style={{
              borderLeft: `5px solid ${item.color}`,
              background: "#F8FAFC",
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 30,
                marginBottom: 10,
              }}
            >
              {item.icon}
            </div>

            <div
              style={{
                fontWeight: 700,
                color: "#0F172A",
                fontSize: 16,
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: item.color,
                marginTop: 8,
              }}
            >
              {item.value}
            </div>

            <div
              style={{
                marginTop: 10,
                color: "#64748B",
                lineHeight: 1.5,
                fontSize: 14,
              }}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
