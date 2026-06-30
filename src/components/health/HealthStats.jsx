import StatCard from "../ui/StatCard";

export default function HealthStats({ records = [] }) {
  const total = records.length;

  const vaccinations = records.filter(
    (r) => r.treatment_type === "Vaccination"
  ).length;

  const deworming = records.filter(
    (r) => r.treatment_type === "Deworming"
  ).length;

  const today = new Date();

  const dueSoon = records.filter((r) => {
    if (!r.next_due) return false;

    const due = new Date(r.next_due);
    const diffDays = Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    return diffDays >= 0 && diffDays <= 7;
  }).length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
        marginBottom: 25,
      }}
    >
      <StatCard
        title="Total Records"
        value={total}
        icon="❤️"
        color="#D32F2F"
      />

      <StatCard
        title="Vaccinations"
        value={vaccinations}
        icon="💉"
        color="#2E7D32"
      />

      <StatCard
        title="Deworming"
        value={deworming}
        icon="🪱"
        color="#6A1B9A"
      />

      <StatCard
        title="Due Soon"
        value={dueSoon}
        icon="⚠️"
        color="#EF6C00"
      />
    </div>
  );
}
