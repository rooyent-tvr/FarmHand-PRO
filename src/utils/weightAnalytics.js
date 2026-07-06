export function calculateWeightAnalytics(records = []) {
  if (!records.length) {
    return null;
  }

  // Oldest → Newest
  const sorted = [...records].sort(
    (a, b) =>
      new Date(a.created_at) -
      new Date(b.created_at)
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const firstWeight = Number(first.weight);
  const lastWeight = Number(last.weight);

  const highestWeight = Math.max(
    ...sorted.map((r) => Number(r.weight))
  );

  const lowestWeight = Math.min(
    ...sorted.map((r) => Number(r.weight))
  );

  const totalGain = lastWeight - firstWeight;

  const totalDays = Math.max(
    1,
    Math.floor(
      (new Date(last.recorded_at) -
        new Date(first.recorded_at)) /
        (1000 * 60 * 60 * 24)
    )
  );

  const growthPercentage =
    firstWeight > 0
      ? (totalGain / firstWeight) * 100
      : 0;

  const averageDailyGain =
    totalGain / totalDays;

  const daysSinceLastWeight =
    Math.floor(
      (new Date() -
        new Date(last.recorded_at)) /
        (1000 * 60 * 60 * 24)
    );

  return {
    highestWeight,
    lowestWeight,
    totalGain,
    growthPercentage,
    averageDailyGain,
    totalDays,
    records: sorted.length,
    daysSinceLastWeight,
  };
}
