const GESTATION_DAYS = {
  Cattle: 283,
  Sheep: 147,
  Goat: 150,
  Goats: 150,
  Pig: 114,
  Pigs: 114,
  Horse: 340,
};

export function calculatePregnancy(record) {
  if (!record) return null;

  const breedingDate = new Date(record.breeding_date);
  const today = new Date();

  let gestation =
    GESTATION_DAYS[record.animal_type] || 283;

  // Fallback if expected birth exists
  if (record.expected_birth) {
    const expected = new Date(record.expected_birth);
    const diff =
      Math.round(
        (expected - breedingDate) /
          (1000 * 60 * 60 * 24)
      );

    if (diff > 0) {
      gestation = diff;
    }
  }

  const pregnantDays = Math.max(
    0,
    Math.floor(
      (today - breedingDate) /
        (1000 * 60 * 60 * 24)
    )
  );

  const daysRemaining = Math.max(
    0,
    gestation - pregnantDays
  );

  const progress = Math.min(
    100,
    Math.round(
      (pregnantDays / gestation) * 100
    )
  );

  const dueSoon =
    daysRemaining <= 30 && daysRemaining > 0;

  const overdue =
    pregnantDays > gestation;

  return {
    gestation,
    pregnantDays,
    daysRemaining,
    progress,
    dueSoon,
    overdue,
    expectedBirth:
      record.expected_birth || null,
    status: record.status || "Bred",
  };
}

export function getLatestPregnancy(records = []) {
  if (!records.length) return null;

  const sorted = [...records].sort(
    (a, b) =>
      new Date(b.breeding_date) -
      new Date(a.breeding_date)
  );

  return calculatePregnancy(sorted[0]);
}
