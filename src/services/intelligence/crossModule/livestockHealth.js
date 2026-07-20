/**
 * FarmHand PRO — Cross-Module Intelligence
 * Livestock + Health Provider
 *
 * Combines livestock, breeding, health, and weight data to detect
 * compound risks where multiple health indicators converge on the same animal.
 *
 * Expected data shape:
 * {
 *   livestock: {
 *     animals: [],         // Array of animal objects with id, tag, name
 *     healthRecords: [],   // Array with next_due, livestock_id/livestock.tag
 *     breedingRecords: [], // Array with expected_birth, status, female.tag, female_id
 *     weightRecords: []    // Array with animal_id, date/created_at
 *   }
 * }
 *
 * @param {object} data - Farm data context
 * @returns {Array} Array of insight objects
 */
export function generateLivestockHealthInsights(data = {}) {
  try {
    const livestock = data.livestock || {};
    const animals = Array.isArray(livestock.animals) ? livestock.animals : [];
    const healthRecords = Array.isArray(livestock.healthRecords) ? livestock.healthRecords : [];
    const breedingRecords = Array.isArray(livestock.breedingRecords) ? livestock.breedingRecords : [];
    const weightRecords = Array.isArray(livestock.weightRecords) ? livestock.weightRecords : [];

    if (animals.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const insights = [];

    // Critical: Pregnant animals due within 30 days with overdue treatments
    if (breedingRecords.length > 0 && healthRecords.length > 0) {
      const pregnantWithOverdueHealth = findPregnantWithOverdueHealth(
        animals, breedingRecords, healthRecords, today
      );
      if (pregnantWithOverdueHealth.length > 0) {
        insights.push(buildPregnantOverdueInsight(pregnantWithOverdueHealth));
      }
    }

    // High: Overdue treatments + no weight in 90 days
    if (healthRecords.length > 0 && weightRecords.length > 0) {
      const neglectedAnimals = findOverdueAndStaleWeight(
        animals, healthRecords, weightRecords, today
      );
      if (neglectedAnimals.length > 0) {
        insights.push(buildNeglectedAnimalInsight(neglectedAnimals));
      }
    }

    // Medium: Multiple births soon without recent pregnancy health checks
    if (breedingRecords.length > 0) {
      const uncheckedPregnancies = findUncheckedPregnancies(
        animals, breedingRecords, healthRecords, today
      );
      if (uncheckedPregnancies.length >= 3) {
        insights.push(buildUncheckedPregnancyInsight(uncheckedPregnancies));
      }
    }

    return insights;
  } catch {
    return [];
  }
}

// =====================================================
// Detection Helpers
// =====================================================

/**
 * Finds animals that are pregnant (birth within 30 days) AND have overdue health treatments.
 */
function findPregnantWithOverdueHealth(animals, breedingRecords, healthRecords, today) {
  const thirtyDays = new Date(today);
  thirtyDays.setDate(thirtyDays.getDate() + 30);

  // Get animal IDs with overdue health treatments
  const overdueAnimalIds = new Set();
  for (const record of healthRecords) {
    if (!record.next_due) continue;
    const dueDate = new Date(record.next_due);
    dueDate.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      const animalId = record.livestock_id || record.animal_id;
      if (animalId) overdueAnimalIds.add(animalId);
    }
  }

  if (overdueAnimalIds.size === 0) return [];

  // Find pregnant animals due within 30 days that also have overdue health
  const results = [];
  for (const record of breedingRecords) {
    if (record.status !== "Pregnant") continue;
    if (!record.expected_birth) continue;

    const birthDate = new Date(record.expected_birth);
    birthDate.setHours(0, 0, 0, 0);
    if (birthDate < today || birthDate > thirtyDays) continue;

    const femaleId = record.female_id || record.livestock_id;
    if (femaleId && overdueAnimalIds.has(femaleId)) {
      const animal = animals.find((a) => a.id === femaleId);
      results.push(animal || { tag: record.female?.tag || "Unknown" });
    }
  }

  return results;
}

/**
 * Finds animals with overdue health treatments AND no weight recorded in 90+ days.
 */
function findOverdueAndStaleWeight(animals, healthRecords, weightRecords, today) {
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  // Build latest weight date per animal
  const latestWeight = {};
  for (const record of weightRecords) {
    const animalId = record.animal_id || record.livestock_id;
    if (!animalId) continue;
    const dateStr = record.date || record.created_at;
    if (!dateStr) continue;
    const recordDate = new Date(dateStr);
    if (!latestWeight[animalId] || recordDate > latestWeight[animalId]) {
      latestWeight[animalId] = recordDate;
    }
  }

  // Get animal IDs with overdue treatments
  const overdueAnimalIds = new Set();
  for (const record of healthRecords) {
    if (!record.next_due) continue;
    const dueDate = new Date(record.next_due);
    dueDate.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      const animalId = record.livestock_id || record.animal_id;
      if (animalId) overdueAnimalIds.add(animalId);
    }
  }

  // Find animals that are both overdue AND have stale weight
  const results = [];
  for (const animalId of overdueAnimalIds) {
    const lastWeightDate = latestWeight[animalId];
    const isStale = !lastWeightDate || lastWeightDate < ninetyDaysAgo;

    if (isStale) {
      const animal = animals.find((a) => a.id === animalId);
      if (animal) results.push(animal);
    }
  }

  return results;
}

/**
 * Finds pregnant animals due within 30 days that have no recent pregnancy-related
 * health activity (no health record in the last 30 days).
 */
function findUncheckedPregnancies(animals, breedingRecords, healthRecords, today) {
  const thirtyDays = new Date(today);
  thirtyDays.setDate(thirtyDays.getDate() + 30);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Build set of animal IDs that had a health check in the last 30 days
  const recentHealthIds = new Set();
  for (const record of healthRecords) {
    const dateStr = record.date || record.created_at || record.treatment_date;
    if (!dateStr) continue;
    const recordDate = new Date(dateStr);
    if (recordDate >= thirtyDaysAgo) {
      const animalId = record.livestock_id || record.animal_id;
      if (animalId) recentHealthIds.add(animalId);
    }
  }

  // Find pregnant animals due within 30 days without recent health activity
  const results = [];
  for (const record of breedingRecords) {
    if (record.status !== "Pregnant") continue;
    if (!record.expected_birth) continue;

    const birthDate = new Date(record.expected_birth);
    birthDate.setHours(0, 0, 0, 0);
    if (birthDate < today || birthDate > thirtyDays) continue;

    const femaleId = record.female_id || record.livestock_id;
    if (femaleId && !recentHealthIds.has(femaleId)) {
      const animal = animals.find((a) => a.id === femaleId);
      results.push(animal || { tag: record.female?.tag || "Unknown" });
    }
  }

  return results;
}

// =====================================================
// Formatting
// =====================================================

function formatAnimalNames(animals, max = 3) {
  const names = animals
    .slice(0, max)
    .map((a) => a.tag || a.name || "Unknown");
  const suffix = animals.length > max ? ` and ${animals.length - max} more` : "";
  return names.join(", ") + suffix;
}

// =====================================================
// Insight Builders
// =====================================================

function buildPregnantOverdueInsight(affected) {
  const count = affected.length;
  return {
    id: "cross-livestock-pregnant-overdue",
    priority: "Critical",
    category: "Livestock",
    title: "Pregnant Animals with Overdue Treatments",
    description: `${formatAnimalNames(affected)} ${count === 1 ? "is" : "are"} due to give birth within 30 days but ${count === 1 ? "has" : "have"} overdue health treatments. Complete treatments urgently to protect both mother and offspring.`,
    action: "Review treatments",
    route: "/health",
    source: "Livestock + Health",
  };
}

function buildNeglectedAnimalInsight(affected) {
  const count = affected.length;
  return {
    id: "cross-livestock-neglected",
    priority: "High",
    category: "Livestock",
    title: "Animals Need Attention",
    description: `${formatAnimalNames(affected)} ${count === 1 ? "has" : "have"} overdue health treatments and no weight recorded in over 90 days. This combination may indicate declining health. Prioritise inspection.`,
    action: "Check animals",
    route: "/livestock",
    source: "Livestock + Health",
  };
}

function buildUncheckedPregnancyInsight(affected) {
  const count = affected.length;
  return {
    id: "cross-livestock-unchecked-pregnancy",
    priority: "Medium",
    category: "Livestock",
    title: "Pregnancy Health Checks Needed",
    description: `${count} pregnant animal${count === 1 ? "" : "s"} (${formatAnimalNames(affected)}) ${count === 1 ? "is" : "are"} due within 30 days without a recent health check. Schedule pre-birth examinations.`,
    action: "View breeding",
    route: "/breeding",
    source: "Livestock + Health",
  };
}
