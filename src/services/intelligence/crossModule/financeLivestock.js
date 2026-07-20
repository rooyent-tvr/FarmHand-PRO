/**
 * FarmHand PRO — Cross-Module Intelligence
 * Finance + Livestock Provider
 *
 * Combines financial records with livestock data to detect
 * cost-efficiency issues, declining ROI, and misaligned spending.
 *
 * Expected data shape:
 * {
 *   finance: {
 *     records: []  // Array with type, category, amount, date/created_at
 *   },
 *   livestock: {
 *     animals: [],
 *     healthRecords: [],   // Array with next_due, date/created_at
 *     breedingRecords: [], // Array with expected_birth, status
 *     weightRecords: []    // Array with animal_id, weight, date/created_at
 *   }
 * }
 *
 * @param {object} data - Farm data context
 * @returns {Array} Array of insight objects
 */
export function generateFinanceLivestockInsights(data = {}) {
  try {
    const finance = data.finance || {};
    const livestock = data.livestock || {};

    const records = Array.isArray(finance.records) ? finance.records : [];
    const animals = Array.isArray(livestock.animals) ? livestock.animals : [];
    const healthRecords = Array.isArray(livestock.healthRecords) ? livestock.healthRecords : [];
    const breedingRecords = Array.isArray(livestock.breedingRecords) ? livestock.breedingRecords : [];
    const weightRecords = Array.isArray(livestock.weightRecords) ? livestock.weightRecords : [];

    if (records.length === 0 || animals.length === 0) return [];

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const insights = [];

    // Critical: Feed costs up + weight gain declining
    const feedInsight = evaluateFeedEfficiency(records, weightRecords, thisMonth, thisYear, lastMonth, lastMonthYear);
    if (feedInsight) {
      insights.push(feedInsight);
    }

    // High: Vet costs up + health issues increasing
    const vetInsight = evaluateVetCosts(records, healthRecords, thisMonth, thisYear, lastMonth, lastMonthYear);
    if (vetInsight) {
      insights.push(vetInsight);
    }

    // High: Livestock income declining + expenses increasing
    const roiInsight = evaluateLivestockROI(records, thisMonth, thisYear, lastMonth, lastMonthYear);
    if (roiInsight) {
      insights.push(roiInsight);
    }

    // Medium: Breeding costs up but few expected births
    const breedingInsight = evaluateBreedingSpend(records, breedingRecords, thisMonth, thisYear, lastMonth, lastMonthYear);
    if (breedingInsight) {
      insights.push(breedingInsight);
    }

    return insights;
  } catch {
    return [];
  }
}

// =====================================================
// Finance Helpers
// =====================================================

/**
 * Gets expense records for a specific month matching category keywords.
 */
function getMonthlyExpensesByKeywords(records, month, year, keywords) {
  return records.filter((r) => {
    const type = (r.type || "").toLowerCase();
    if (type !== "expense") return false;
    const dateStr = r.date || r.created_at;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (d.getMonth() !== month || d.getFullYear() !== year) return false;
    const category = (r.category || r.description || "").toLowerCase();
    return keywords.some((kw) => category.includes(kw));
  });
}

/**
 * Sums amounts from a set of records.
 */
function sumAmounts(records) {
  return records.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
}

/**
 * Gets income records for a specific month matching category keywords.
 */
function getMonthlyIncomeByKeywords(records, month, year, keywords) {
  return records.filter((r) => {
    const type = (r.type || "").toLowerCase();
    if (type !== "income") return false;
    const dateStr = r.date || r.created_at;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (d.getMonth() !== month || d.getFullYear() !== year) return false;
    const category = (r.category || r.description || "").toLowerCase();
    return keywords.some((kw) => category.includes(kw));
  });
}

// =====================================================
// Weight Helpers
// =====================================================

/**
 * Calculates average weight gain between two months.
 * Returns null if insufficient data.
 */
function getAverageWeightForMonth(weightRecords, month, year) {
  const monthWeights = weightRecords.filter((r) => {
    const dateStr = r.date || r.created_at;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  if (monthWeights.length === 0) return null;

  const total = monthWeights.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
  return total / monthWeights.length;
}

// =====================================================
// Rule Evaluators
// =====================================================

const FEED_KEYWORDS = ["feed", "fodder", "hay", "grain", "supplement", "lick", "meal"];
const VET_KEYWORDS = ["vet", "veterinary", "medicine", "medication", "treatment", "vaccine"];
const LIVESTOCK_KEYWORDS = ["livestock", "cattle", "animal", "herd", "stock", "sale"];
const BREEDING_KEYWORDS = ["breeding", "insemination", "ai", "bull", "semen", "stud"];

/**
 * Critical: Feed costs increased while weight gain declined.
 */
function evaluateFeedEfficiency(records, weightRecords, thisMonth, thisYear, lastMonth, lastMonthYear) {
  const thisMonthFeed = sumAmounts(getMonthlyExpensesByKeywords(records, thisMonth, thisYear, FEED_KEYWORDS));
  const lastMonthFeed = sumAmounts(getMonthlyExpensesByKeywords(records, lastMonth, lastMonthYear, FEED_KEYWORDS));

  if (lastMonthFeed <= 0 || thisMonthFeed <= lastMonthFeed) return null;

  const thisMonthWeight = getAverageWeightForMonth(weightRecords, thisMonth, thisYear);
  const lastMonthWeight = getAverageWeightForMonth(weightRecords, lastMonth, lastMonthYear);

  if (thisMonthWeight === null || lastMonthWeight === null) return null;
  if (thisMonthWeight >= lastMonthWeight) return null;

  const costIncrease = Math.round(((thisMonthFeed - lastMonthFeed) / lastMonthFeed) * 100);

  return {
    id: "cross-finance-feed-efficiency",
    priority: "Critical",
    category: "Finance",
    title: "Feed Costs Up, Weight Gain Down",
    description: `Feed expenses increased by ${costIncrease}% this month while average livestock weight has declined. Review feed quality, quantities, and supplier pricing.`,
    action: "Review finance",
    route: "/finance",
    source: "Finance + Livestock",
  };
}

/**
 * High: Vet costs increased while health issues are also increasing.
 */
function evaluateVetCosts(records, healthRecords, thisMonth, thisYear, lastMonth, lastMonthYear) {
  const thisMonthVet = sumAmounts(getMonthlyExpensesByKeywords(records, thisMonth, thisYear, VET_KEYWORDS));
  const lastMonthVet = sumAmounts(getMonthlyExpensesByKeywords(records, lastMonth, lastMonthYear, VET_KEYWORDS));

  if (lastMonthVet <= 0 || thisMonthVet <= lastMonthVet) return null;

  // Check if overdue treatments have also increased
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueCount = healthRecords.filter((r) => {
    if (!r.next_due) return false;
    const dueDate = new Date(r.next_due);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  if (overdueCount === 0) return null;

  const costIncrease = Math.round(((thisMonthVet - lastMonthVet) / lastMonthVet) * 100);

  return {
    id: "cross-finance-vet-escalation",
    priority: "High",
    category: "Finance",
    title: "Veterinary Costs Escalating",
    description: `Vet expenses increased by ${costIncrease}% while ${overdueCount} treatment${overdueCount === 1 ? " remains" : "s remain"} overdue. Address root causes to reduce recurring costs.`,
    action: "Review health",
    route: "/health",
    source: "Finance + Livestock",
  };
}

/**
 * High: Livestock income declining while livestock expenses are increasing.
 */
function evaluateLivestockROI(records, thisMonth, thisYear, lastMonth, lastMonthYear) {
  const thisMonthIncome = sumAmounts(getMonthlyIncomeByKeywords(records, thisMonth, thisYear, LIVESTOCK_KEYWORDS));
  const lastMonthIncome = sumAmounts(getMonthlyIncomeByKeywords(records, lastMonth, lastMonthYear, LIVESTOCK_KEYWORDS));

  const thisMonthExpense = sumAmounts(getMonthlyExpensesByKeywords(records, thisMonth, thisYear, [...FEED_KEYWORDS, ...VET_KEYWORDS, ...LIVESTOCK_KEYWORDS]));
  const lastMonthExpense = sumAmounts(getMonthlyExpensesByKeywords(records, lastMonth, lastMonthYear, [...FEED_KEYWORDS, ...VET_KEYWORDS, ...LIVESTOCK_KEYWORDS]));

  if (lastMonthIncome <= 0 || lastMonthExpense <= 0) return null;
  if (thisMonthIncome >= lastMonthIncome) return null;
  if (thisMonthExpense <= lastMonthExpense) return null;

  return {
    id: "cross-finance-livestock-roi",
    priority: "High",
    category: "Finance",
    title: "Livestock ROI Declining",
    description: "Livestock income has decreased while operating expenses have increased compared to last month. Review herd productivity and cost structure.",
    action: "Review finance",
    route: "/finance",
    source: "Finance + Livestock",
  };
}

/**
 * Medium: Breeding costs up but few expected births.
 */
function evaluateBreedingSpend(records, breedingRecords, thisMonth, thisYear, lastMonth, lastMonthYear) {
  const thisMonthBreeding = sumAmounts(getMonthlyExpensesByKeywords(records, thisMonth, thisYear, BREEDING_KEYWORDS));
  const lastMonthBreeding = sumAmounts(getMonthlyExpensesByKeywords(records, lastMonth, lastMonthYear, BREEDING_KEYWORDS));

  if (lastMonthBreeding <= 0 || thisMonthBreeding <= lastMonthBreeding) return null;

  // Count expected births within 60 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sixtyDays = new Date(today);
  sixtyDays.setDate(sixtyDays.getDate() + 60);

  const expectedBirths = breedingRecords.filter((r) => {
    if (r.status !== "Pregnant") return false;
    if (!r.expected_birth) return false;
    const birthDate = new Date(r.expected_birth);
    birthDate.setHours(0, 0, 0, 0);
    return birthDate >= today && birthDate <= sixtyDays;
  }).length;

  if (expectedBirths >= 3) return null;

  const costIncrease = Math.round(((thisMonthBreeding - lastMonthBreeding) / lastMonthBreeding) * 100);

  return {
    id: "cross-finance-breeding-roi",
    priority: "Medium",
    category: "Finance",
    title: "Breeding Costs Rising, Few Expected Births",
    description: `Breeding expenses increased by ${costIncrease}% but only ${expectedBirths} birth${expectedBirths === 1 ? " is" : "s are"} expected in the next 60 days. Review breeding programme effectiveness.`,
    action: "View breeding",
    route: "/breeding",
    source: "Finance + Livestock",
  };
}
