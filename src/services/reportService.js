import { getAnimals } from "./livestockService";
import { getFinanceRecords } from "./financeService";
import { getBreedingRecords } from "./breedingService";
import { getHealthRecords } from "./healthService";

function safeResult(result) {
  return result.status === "fulfilled" ? result.value : [];
}

export async function getFarmReport() {
  const results = await Promise.allSettled([
    getAnimals(),
    getFinanceRecords(),
    getBreedingRecords(),
    getHealthRecords(),
  ]);

  const animals = safeResult(results[0]);
  const finance = safeResult(results[1]);
  const breeding = safeResult(results[2]);
  const health = safeResult(results[3]);

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

  const netProfit = totalIncome - totalExpenses;

  return {
    totalAnimals,
    totalIncome,
    totalExpenses,
    netProfit,

    animals,
    finance,
    breeding,
    health,
  };
}
