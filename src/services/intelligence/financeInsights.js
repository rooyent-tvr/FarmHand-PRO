/**
 * FarmHand PRO — Intelligence Engine
 * Finance Insights Provider
 *
 * Generates actionable insights from financial records.
 * Covers profitability alerts, expense trends, and spending concentration.
 *
 * Expected data shape:
 * {
 *   finance: {
 *     records: []  // Array of finance records with type, category, amount, date/created_at
 *   }
 * }
 *
 * @param {object} data - Farm data context
 * @returns {Array} Array of insight objects
 */
export function generateFinanceInsights(data = {}) {
  try {
    const finance = data.finance || {};
    const records = Array.isArray(finance.records) ? finance.records : [];

    const insights = [];

    if (records.length === 0) {
      insights.push(buildNoRecordsInsight());
      return insights;
    }

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const thisMonthRecords = getRecordsForMonth(records, thisMonth, thisYear);
    const lastMonthRecords = getRecordsForMonth(records, lastMonth, lastMonthYear);

    const thisMonthIncome = sumByType(thisMonthRecords, "Income");
    const thisMonthExpenses = sumByType(thisMonthRecords, "Expense");
    const lastMonthExpenses = sumByType(lastMonthRecords, "Expense");

    // Expenses exceed income — Critical
    if (thisMonthExpenses > 0 && thisMonthExpenses > thisMonthIncome) {
      insights.push(buildExpensesExceedIncomeInsight(thisMonthIncome, thisMonthExpenses));
    }

    // Expenses increased >20% vs last month — High
    const expenseGrowth = evaluateExpenseGrowth(thisMonthExpenses, lastMonthExpenses);
    if (expenseGrowth) {
      insights.push(expenseGrowth);
    }

    // Spending concentration — Medium
    const concentrationInsight = evaluateSpendingConcentration(thisMonthRecords, thisMonthExpenses);
    if (concentrationInsight) {
      insights.push(concentrationInsight);
    }

    return insights;
  } catch {
    return [];
  }
}

// =====================================================
// Helpers
// =====================================================

/**
 * Filters records belonging to a specific month and year.
 */
function getRecordsForMonth(records, month, year) {
  return records.filter((r) => {
    const dateStr = r.date || r.created_at;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

/**
 * Sums amounts for a given transaction type (Income or Expense).
 */
function sumByType(records, type) {
  return records
    .filter((r) => {
      const t = (r.type || r.category || "").toLowerCase();
      return t === type.toLowerCase();
    })
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
}

/**
 * Evaluates whether expenses have grown >20% compared to last month.
 */
function evaluateExpenseGrowth(thisMonth, lastMonth) {
  if (lastMonth <= 0) return null;

  const growth = ((thisMonth - lastMonth) / lastMonth) * 100;

  if (growth > 20) {
    return {
      id: "finance-expense-growth",
      priority: "High",
      category: "Finance",
      title: "Expenses Increasing",
      description: `Monthly expenses have increased by ${Math.round(growth)}% compared to last month. Review recent spending for unexpected costs.`,
      action: "Review expenses",
      route: "/finance",
      source: "Finance",
    };
  }

  return null;
}

/**
 * Evaluates whether a single category accounts for >40% of monthly expenses.
 */
function evaluateSpendingConcentration(monthRecords, totalExpenses) {
  if (totalExpenses <= 0) return null;

  const expenseRecords = monthRecords.filter((r) => {
    const t = (r.type || r.category || "").toLowerCase();
    return t === "expense";
  });

  // Group by category
  const byCategory = {};
  for (const r of expenseRecords) {
    const cat = r.category || r.description || "Other";
    byCategory[cat] = (byCategory[cat] || 0) + (Number(r.amount) || 0);
  }

  // Find the largest category
  let largestCategory = null;
  let largestAmount = 0;

  for (const [cat, amount] of Object.entries(byCategory)) {
    if (amount > largestAmount) {
      largestCategory = cat;
      largestAmount = amount;
    }
  }

  if (!largestCategory) return null;

  const percentage = (largestAmount / totalExpenses) * 100;

  if (percentage > 40) {
    return {
      id: "finance-spending-concentration",
      priority: "Medium",
      category: "Finance",
      title: "Spending Concentration",
      description: `"${largestCategory}" accounts for ${Math.round(percentage)}% of this month's expenses. Diversifying spending reduces financial risk.`,
      action: "Analyse categories",
      route: "/finance",
      source: "Finance",
    };
  }

  return null;
}

/**
 * Builds the insight when expenses exceed income for the current month.
 */
function buildExpensesExceedIncomeInsight(income, expenses) {
  const deficit = expenses - income;

  return {
    id: "finance-deficit",
    priority: "Critical",
    category: "Finance",
    title: "Expenses Exceed Income",
    description: `This month's expenses (R${expenses.toLocaleString()}) exceed income (R${income.toLocaleString()}) by R${deficit.toLocaleString()}. Review spending before additional purchases.`,
    action: "Review finances",
    route: "/finance",
    source: "Finance",
  };
}

/**
 * Builds the informational insight when no records exist.
 */
function buildNoRecordsInsight() {
  return {
    id: "finance-no-records",
    priority: "Low",
    category: "Finance",
    title: "No Financial Records",
    description: "No income or expense records have been recorded yet. Start tracking finances to unlock profitability insights.",
    action: "Add transaction",
    route: "/finance",
    source: "Finance",
  };
}
