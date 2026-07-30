/**
 * FarmHand PRO — Finance Analytics Engine
 * Sprint 30 + Finance Module 2.0 Fix
 *
 * Generates financial analytics from ALL recorded transactions
 * regardless of applies_to scope (farm, livestock, animal).
 *
 * @param {object} params
 * @param {Array} params.financeRecords - Finance records from Supabase
 *
 * @returns {object} Analytics object for FinanceInsights component
 */

export function generateFinanceAnalytics({ financeRecords = [] } = {}) {
  if (financeRecords.length === 0) {
    return { available: false };
  }

  // Separate income and expenses using the `category` field
  const incomeRecords = financeRecords.filter(
    (r) => r.category === "Income" || r.category === "income"
  );
  const expenseRecords = financeRecords.filter(
    (r) => r.category === "Expense" || r.category === "expense"
  );

  const totalIncome = incomeRecords.reduce(
    (sum, r) => sum + (Number(r.amount) || 0),
    0
  );
  const totalExpenses = expenseRecords.reduce(
    (sum, r) => sum + (Number(r.amount) || 0),
    0
  );

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0
    ? (netProfit / totalIncome) * 100
    : 0;

  // Largest expense by transaction_type
  const expenseByType = {};
  for (const r of expenseRecords) {
    const type = r.transaction_type || "Other";
    expenseByType[type] = (expenseByType[type] || 0) + (Number(r.amount) || 0);
  }
  const largestExpenseCategory = Object.entries(expenseByType)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Largest income by transaction_type
  const incomeByType = {};
  for (const r of incomeRecords) {
    const type = r.transaction_type || "Other";
    incomeByType[type] = (incomeByType[type] || 0) + (Number(r.amount) || 0);
  }
  const largestIncomeSource = Object.entries(incomeByType)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Monthly trend (compare last 2 months of net)
  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const thisYear = now.getFullYear();
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  function getMonthNet(month, year) {
    const income = financeRecords
      .filter((r) => {
        if (r.category !== "Income" && r.category !== "income") return false;
        const d = new Date(r.transaction_date || r.created_at);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const expenses = financeRecords
      .filter((r) => {
        if (r.category !== "Expense" && r.category !== "expense") return false;
        const d = new Date(r.transaction_date || r.created_at);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    return income - expenses;
  }

  const thisMonthNet = getMonthNet(thisMonth, thisYear);
  const lastMonthNet = getMonthNet(lastMonth, lastMonthYear);

  let monthlyTrend = null;
  if (thisMonthNet > lastMonthNet) monthlyTrend = "up";
  else if (thisMonthNet < lastMonthNet) monthlyTrend = "down";

  // Insights
  const insights = [];

  if (profitMargin >= 20) {
    insights.push({
      message: "Profit margin remains above target.",
      severity: "low",
    });
  } else if (profitMargin >= 0) {
    insights.push({
      message: "Profit margin is below 20%. Review expenses.",
      severity: "medium",
    });
  } else {
    insights.push({
      message: "Farm is currently operating at a loss.",
      severity: "high",
    });
  }

  if (largestExpenseCategory) {
    const topExpenseAmount = expenseByType[largestExpenseCategory] || 0;
    const expensePercentage = totalExpenses > 0
      ? Math.round((topExpenseAmount / totalExpenses) * 100)
      : 0;

    if (expensePercentage > 40) {
      insights.push({
        message: `${largestExpenseCategory} accounts for ${expensePercentage}% of expenses.`,
        severity: "medium",
      });
    }
  }

  if (monthlyTrend === "up") {
    insights.push({
      message: "Monthly profitability is trending upwards.",
      severity: "low",
    });
  } else if (monthlyTrend === "down") {
    insights.push({
      message: "Monthly profitability has decreased compared to last month.",
      severity: "medium",
    });
  }

  return {
    available: true,
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin,
    largestExpenseCategory,
    largestIncomeSource,
    monthlyTrend,
    insights,
  };
}
