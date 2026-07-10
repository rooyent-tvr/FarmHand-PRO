import { getAnimals } from "./livestockService";
import { getFinanceRecords } from "./financeService";
import { getBreedingRecords } from "./breedingService";
import { getHealthRecords } from "./healthService";

export async function getFarmReport() {
  const [
    animals,
    finance,
    breeding,
    health,
  ] = await Promise.all([
    getAnimals(),
    getFinanceRecords(),
    getBreedingRecords(),
    getHealthRecords(),
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

    animals,
    finance,
    breeding,
    health,
  };
}
