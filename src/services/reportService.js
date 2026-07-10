import { getAnimals } from "./livestockService";
import { getFinanceRecords } from "./financeService";

export async function getFarmReport() {
  const [animals, finance] = await Promise.all([
    getAnimals(),
    getFinanceRecords(),
  ]);

  const totalAnimals = animals.length;

  const totalIncome = finance
    .filter((r) => r.category === "Income")
    .reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0
    );

  const totalExpenses = finance
    .filter((r) => r.category === "Expense")
    .reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0
    );

  const netProfit =
    totalIncome - totalExpenses;

  return {
    totalAnimals,
    totalIncome,
    totalExpenses,
    netProfit,
  };
}
