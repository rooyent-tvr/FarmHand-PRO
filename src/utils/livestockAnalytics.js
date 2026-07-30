/**
 * FarmHand PRO — Livestock Analytics Engine
 * Sprint 43.1.1
 *
 * SINGLE SOURCE OF TRUTH for all livestock statistics.
 * Every widget on the Livestock page consumes this object.
 *
 * ============================================================
 * METRIC DEFINITIONS
 * ============================================================
 *
 * totalAnimals
 *   Total number of animals in the livestock table.
 *
 * healthyAnimals
 *   Animals whose `status` field equals "Healthy".
 *   This represents the farmer's own assessment stored in the DB.
 *
 * needAttention
 *   Animals that meet ANY of:
 *   • status is "Sick" or "Injured"
 *   • overdue for health inspection (no health record in 60+ days)
 *   • have no weight recorded AND no health record in 30+ days
 *
 * pregnantAnimals
 *   Animals whose `status` field equals "Pregnant".
 *   This is the primary pregnancy indicator from the livestock table.
 *   Breeding records with status "Confirmed"/"Pregnant" are used
 *   as supplementary data for insights (e.g. due date tracking).
 *
 * averageWeight
 *   Mean weight of animals that have a non-null weight field.
 *   Animals with weight=0 or weight=null are excluded from the average.
 *
 * activeTreatments
 *   Health records created in the last 14 days with treatment-type category.
 *
 * healthScore (0-100)
 *   Composite score based on:
 *   • Profile completeness (weight + breed + DOB present)
 *   • Recent health record coverage (within 30 days)
 *   • Overdue health inspections (60+ days penalty)
 *   • Pregnant monitoring (bonus)
 *   • Herd size baseline
 *
 * healthStatus
 *   Derived from healthScore:
 *   85+ = Excellent, 70+ = Good, 50+ = Fair, 30+ = Poor, <30 = Critical
 *
 * ============================================================
 */

/**
 * @param {object} params
 * @param {Array} params.animals - Livestock records from Supabase
 * @param {Array} params.healthRecords - animal_health records
 * @param {Array} params.breedingRecords - breeding_records
 * @returns {object} Unified analytics object
 */
export function generateLivestockAnalytics({
  animals = [],
  healthRecords = [],
  breedingRecords = [],
} = {}) {
  if (animals.length === 0) {
    return {
      available: false,
      totalAnimals: 0,
      healthyAnimals: 0,
      needAttention: 0,
      pregnantAnimals: 0,
      averageWeight: 0,
      activeTreatments: 0,
      score: 0,
      status: "No Animals",
      insights: [],
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sixtyDaysAgo = new Date(today);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // ---------------------------------------------------------------
  // TOTAL ANIMALS
  // ---------------------------------------------------------------
  const totalAnimals = animals.length;

  // ---------------------------------------------------------------
  // HEALTHY ANIMALS (status field = "Healthy")
  // ---------------------------------------------------------------
  const healthyAnimals = animals.filter(
    (a) => a.status === "Healthy"
  ).length;

  // ---------------------------------------------------------------
  // PREGNANT ANIMALS (status field = "Pregnant")
  // ---------------------------------------------------------------
  const pregnantAnimals = animals.filter(
    (a) => a.status === "Pregnant"
  ).length;

  // ---------------------------------------------------------------
  // AVERAGE WEIGHT (animals with non-null, non-zero weight)
  // ---------------------------------------------------------------
  const animalsWithWeight = animals.filter((a) => a.weight && Number(a.weight) > 0);
  const averageWeight = animalsWithWeight.length > 0
    ? Math.round(animalsWithWeight.reduce((sum, a) => sum + Number(a.weight), 0) / animalsWithWeight.length)
    : 0;

  // ---------------------------------------------------------------
  // OVERDUE HEALTH INSPECTION (no record in 60+ days)
  // ---------------------------------------------------------------
  const overdueHealthCheck = animals.filter((a) => {
    const records = healthRecords.filter((r) => r.animal_id === a.id);
    if (records.length === 0) return true;
    const latest = records.sort(
      (x, y) => new Date(y.treatment_date || y.created_at) - new Date(x.treatment_date || x.created_at)
    )[0];
    return new Date(latest.treatment_date || latest.created_at) < sixtyDaysAgo;
  });

  // ---------------------------------------------------------------
  // NEED ATTENTION
  // Animals with status "Sick"/"Injured" OR overdue health OR inactive
  // ---------------------------------------------------------------
  const sickOrInjured = animals.filter(
    (a) => a.status === "Sick" || a.status === "Injured"
  );

  const inactiveNoWeight = animals.filter((a) => {
    if (a.weight && Number(a.weight) > 0) return false;
    const hasRecentHealth = healthRecords.some(
      (r) => r.animal_id === a.id && new Date(r.treatment_date || r.created_at) >= thirtyDaysAgo
    );
    return !hasRecentHealth;
  });

  // Unique set of animals needing attention
  const attentionIds = new Set([
    ...sickOrInjured.map((a) => a.id),
    ...overdueHealthCheck.map((a) => a.id),
    ...inactiveNoWeight.map((a) => a.id),
  ]);
  const needAttention = attentionIds.size;

  // ---------------------------------------------------------------
  // ACTIVE TREATMENTS (health records in last 14 days, treatment type)
  // ---------------------------------------------------------------
  const activeTreatments = healthRecords.filter((r) => {
    const d = new Date(r.treatment_date || r.created_at);
    return d >= fourteenDaysAgo && (
      r.treatment_type === "Treatment" ||
      r.treatment_type === "Medication" ||
      r.type === "Treatment" ||
      r.type === "Medication"
    );
  }).length;

  // ---------------------------------------------------------------
  // HEALTH SCORE
  // ---------------------------------------------------------------
  const complete = animals.filter(
    (a) => a.weight && a.breed && (a.dob || a.date_of_birth)
  );

  const animalIdsWithRecentHealth = new Set(
    healthRecords
      .filter((r) => new Date(r.treatment_date || r.created_at) >= thirtyDaysAgo)
      .map((r) => r.animal_id)
  );

  const score = calculateScore({
    total: totalAnimals,
    complete: complete.length,
    overdueHealth: overdueHealthCheck.length,
    recentHealth: animalIdsWithRecentHealth.size,
    pregnant: pregnantAnimals,
  });

  const status = getStatus(score);

  // ---------------------------------------------------------------
  // AI INSIGHTS
  // ---------------------------------------------------------------
  const pregnantBreedingRecords = breedingRecords.filter(
    (r) => r.status === "Confirmed" || r.status === "Pregnant"
  );

  const insights = generateInsights({
    animals,
    complete,
    overdueHealthCheck,
    sickOrInjured,
    pregnantBreedingRecords,
    activeTreatments,
    healthRecords,
    thirtyDaysAgo,
    inactiveNoWeight,
  });

  return {
    available: true,
    totalAnimals,
    healthyAnimals,
    needAttention,
    pregnantAnimals,
    averageWeight,
    activeTreatments,
    score,
    status,
    insights,
  };
}

// ============================================================
// SCORE CALCULATION
// ============================================================

function calculateScore({ total, complete, overdueHealth, recentHealth, pregnant }) {
  if (total === 0) return 0;

  let score = 55;

  // Complete profiles (+15 max)
  const profileRate = complete / total;
  score += Math.round(profileRate * 15);

  // Recent health checks (+15 max)
  const healthRate = recentHealth / total;
  score += Math.round(healthRate * 15);

  // Overdue health penalty (-8 per overdue, capped at -25)
  score -= Math.min(overdueHealth * 8, 25);

  // Pregnant monitored (+5)
  if (pregnant > 0) score += 5;

  // Baseline for having animals (+5)
  if (total >= 5) score += 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getStatus(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Poor";
  return "Critical";
}

// ============================================================
// INSIGHT GENERATION
// ============================================================

function generateInsights({
  animals,
  complete,
  overdueHealthCheck,
  sickOrInjured,
  pregnantBreedingRecords,
  activeTreatments,
  healthRecords,
  thirtyDaysAgo,
  inactiveNoWeight,
}) {
  const insights = [];

  // Sick or injured animals
  if (sickOrInjured.length > 0) {
    const examples = sickOrInjured.slice(0, 3).map((a) => a.tag || a.name || "Unknown");
    const remaining = sickOrInjured.length - examples.length;
    let msg = `${sickOrInjured.length} animal${sickOrInjured.length === 1 ? " is" : "s are"} currently marked as sick or injured.`;
    if (examples.length > 0) {
      msg += ` Examples: ${examples.join(", ")}`;
      if (remaining > 0) msg += ` + ${remaining} more`;
      msg += ".";
    }
    insights.push({ message: msg, severity: "high", type: "sick_injured" });
  }

  // Overdue health checks
  if (overdueHealthCheck.length > 0) {
    const examples = overdueHealthCheck.slice(0, 3).map((a) => a.tag || a.name || "Unknown");
    const remaining = overdueHealthCheck.length - examples.length;
    let msg = `${overdueHealthCheck.length} animal${overdueHealthCheck.length === 1 ? " requires" : "s require"} a health inspection. Regular checks maintain accurate herd health records.`;
    if (examples.length > 0) {
      msg += ` Examples: ${examples.join(", ")}`;
      if (remaining > 0) msg += ` + ${remaining} more`;
      msg += ".";
    }
    insights.push({
      message: msg,
      severity: overdueHealthCheck.length >= 5 ? "high" : "medium",
      type: "health_overdue",
    });
  }

  // Incomplete profiles
  const incomplete = animals.length - complete.length;
  if (incomplete > 0 && incomplete / animals.length > 0.3) {
    const examples = animals
      .filter((a) => !a.weight || !a.breed || !(a.dob || a.date_of_birth))
      .slice(0, 3)
      .map((a) => a.tag || a.name || "Unknown");
    const remaining = incomplete - examples.length;
    let msg = `${incomplete} animal${incomplete === 1 ? " requires" : "s require"} updated records. Recording weights and completing profiles improves herd monitoring.`;
    if (examples.length > 0) {
      msg += ` Examples: ${examples.join(", ")}`;
      if (remaining > 0) msg += ` + ${remaining} more`;
      msg += ".";
    }
    insights.push({ message: msg, severity: "medium", type: "incomplete_profile" });
  }

  // Pregnancy approaching due
  const pregnantDueSoon = pregnantBreedingRecords.filter((r) => {
    if (!r.expected_due_date) return false;
    const due = new Date(r.expected_due_date);
    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 14);
    return due <= twoWeeks && due >= new Date();
  });
  if (pregnantDueSoon.length > 0) {
    insights.push({
      message: `${pregnantDueSoon.length} pregnancy${pregnantDueSoon.length === 1 ? "" : "ies"} approaching due date within 2 weeks. Monitor closely and prepare for calving.`,
      severity: "medium",
      type: "pregnancy_due",
    });
  }

  // Active treatments
  if (activeTreatments > 0) {
    insights.push({
      message: `${activeTreatments} active treatment${activeTreatments === 1 ? "" : "s"} recorded in the last 14 days. Continue monitoring recovery progress.`,
      severity: "low",
      type: "active_treatment",
    });
  }

  // Inactive animals
  if (inactiveNoWeight.length > 3) {
    const examples = inactiveNoWeight.slice(0, 3).map((a) => a.tag || a.name || "Unknown");
    const remaining = inactiveNoWeight.length - examples.length;
    let msg = `${inactiveNoWeight.length} animals have no recent activity or weight records. Regular monitoring ensures early detection of issues.`;
    if (examples.length > 0) {
      msg += ` Examples: ${examples.join(", ")}`;
      if (remaining > 0) msg += ` + ${remaining} more`;
      msg += ".";
    }
    insights.push({ message: msg, severity: "low", type: "no_activity" });
  }

  // All good
  if (insights.length === 0) {
    insights.push({
      message: "All livestock are healthy and up to date. No immediate actions required.",
      severity: "low",
      type: "all_good",
    });
  }

  return insights;
}
