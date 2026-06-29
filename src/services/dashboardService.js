import { supabase } from "./supabase";

export async function getDashboardStats() {
  const { data, error } = await supabase
    .from("livestock")
    .select("*");

  if (error) throw error;

  const animals = data || [];

  const totalAnimals = animals.length;

  const healthy = animals.filter(
    (a) => a.status === "Healthy"
  ).length;

  const pregnant = animals.filter(
    (a) => a.status === "Pregnant"
  ).length;

  const totalWeight = animals.reduce(
    (sum, a) => sum + Number(a.weight || 0),
    0
  );

  const averageWeight =
    totalAnimals > 0
      ? Math.round(totalWeight / totalAnimals)
      : 0;

  const totalValue = animals.reduce(
    (sum, a) => sum + Number(a.purchase_price || 0),
    0
  );

  const averagePurchasePrice =
    totalAnimals > 0
      ? totalValue / totalAnimals
      : 0;

  const heaviestAnimal =
    animals.length > 0
      ? [...animals].sort(
          (a, b) => b.weight - a.weight
        )[0]
      : null;

  return {
    animals,
    totalAnimals,
    healthy,
    pregnant,
    averageWeight,
    totalValue,
    averagePurchasePrice,
    heaviestAnimal,
  };
}
