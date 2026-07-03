export default function WeightAnalytics({
  records = [],
}) {
  if (records.length === 0) return null;

  // Oldest -> newest
  const sorted = [...records].sort(
    (a, b) =>
      new Date(a.created_at) -
      new Date(b.created_at)
  );

  const weights = sorted.map((r) =>
    Number(r.weight)
  );

  const highestWeight = Math.max(...weights);
  const lowestWeight = Math.min(...weights);

  const latest = sorted[sorted.length - 1];

  const daysSinceLastWeight = Math.floor(
    (new Date() -
      new Date(latest.recorded_at)) /
      (1000 * 60 * 60 * 24)
  );

  let averageDailyGain = 0;

  if (sorted.length > 1) {
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const days = Math.max(
      1,
      Math.floor(
        (new Date(last.recorded_at) -
          new Date(first.recorded_at)) /
          (1000 * 60 * 60 * 24)
      )
    );

    averageDailyGain =
      (last.weight - first.weight) / days;
  }

  const cards = [
    {
      title: "Highest Weight",
      value: `${highestWeight} kg`,
      color: "#16A34A",
    },
    {
      title: "Lowest Weight",
      value: `${lowestWeight} kg`,
      color: "#2563EB",
    },
    {
      title: "Avg Daily Gain",
      value: `${averageDailyGain.toFixed(
        2
      )} kg/day`,
      color: "#7C3AED",
    },
    {
      title: "Days Since Last Weight",
      value: `${daysSinceLastWeight} days`,
      color: "#EA580C",
    },
  ];

  return (
    <>
      <h3
        style={{
          marginBottom: 16,
          fontSize: 20,
          fontWeight: 700,
          color: "#1E293B",
        }}
      >
        📊 Weight Analytics
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              boxShadow:
                "0 8px 20px rgba(15,23,42,.08)",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                color: "#64748B",
                fontSize: 13,
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 28,
                fontWeight: 700,
                color: card.color,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
