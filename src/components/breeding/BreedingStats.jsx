import StatCard from "../ui/StatCard";

export default function BreedingStats({ records = [] }) {
  const total = records.length;

  const pregnant = records.filter(
    (r) => r.status === "Pregnant"
  ).length;

  const completed = records.filter(
    (r) => r.status === "Completed"
  ).length;

  const today = new Date();

  const dueSoon = records.filter((r) => {
    if (!r.expected_birth) return false;

    const due = new Date(r.expected_birth);

    const days = Math.ceil(
      (due - today) /
      (1000 * 60 * 60 * 24)
    );

    return days >= 0 && days <= 30;
  }).length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(240px,1fr))",
        gap: 20,
        marginBottom: 25,
      }}
    >
      <StatCard
        title="Breeding Records"
        value={total}
        icon="🐂"
        color="#1565C0"
      />

      <StatCard
        title="Pregnant"
        value={pregnant}
        icon="🤰"
        color="#2E7D32"
      />

      <StatCard
        title="Due Within 30 Days"
        value={dueSoon}
        icon="📅"
        color="#FB8C00"
      />

      <StatCard
        title="Completed"
        value={completed}
        icon="🎉"
        color="#8E24AA"
      />
    </div>
  );
}
