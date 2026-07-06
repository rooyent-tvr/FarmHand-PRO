import StatCard from "../ui/StatCard";

export default function BreedingStats({ records = [] }) {
  const today = new Date();

  const activePregnancies = records.filter(
    (r) => r.status === "Pregnant"
  ).length;

  const completed = records.filter(
    (r) => r.status === "Completed"
  ).length;

  const pregnancies = records
    .filter(
      (r) =>
        r.status === "Pregnant" &&
        r.expected_birth
    )
    .map((record) => {
      const expected = new Date(
        record.expected_birth
      );

      const daysLeft = Math.ceil(
        (expected - today) /
          (1000 * 60 * 60 * 24)
      );

      return {
        ...record,
        daysLeft,
      };
    });

  const dueSoon = pregnancies.filter(
    (r) =>
      r.daysLeft >= 0 &&
      r.daysLeft <= 30
  ).length;

  const overdue = pregnancies.filter(
    (r) => r.daysLeft < 0
  ).length;

  const nextBirth = pregnancies
    .filter((r) => r.daysLeft >= 0)
    .sort(
      (a, b) =>
        a.daysLeft - b.daysLeft
    )[0];

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
        title="Active Pregnancies"
        value={activePregnancies}
        icon="🐄"
        color="#2E7D32"
      />

      <StatCard
        title="Next Birth"
        value={
          nextBirth
            ? `${nextBirth.daysLeft} Days`
            : "-"
        }
        icon="🍼"
        color="#1565C0"
      />

      <StatCard
        title="Due Within 30 Days"
        value={dueSoon}
        icon="📅"
        color="#FB8C00"
      />

      <StatCard
        title="Overdue"
        value={overdue}
        icon="🚨"
        color="#D32F2F"
      />
    </div>
  );
}
