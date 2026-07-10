import { useEffect, useState } from "react";

import {
  getAnimalFinance,
} from "../../services/financeService";

import AnimalFinanceSummary from "../finance/AnimalFinanceSummary";
import AnimalFinanceHistory from "../finance/AnimalFinanceHistory";

export default function FinanceTab({
  animal,
}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (animal) {
      loadFinance();
    }
  }, [animal]);

  async function loadFinance() {
    try {
      const data =
        await getAnimalFinance(
          animal.id
        );

      setRecords(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <p>
        Loading financial history...
      </p>
    );
  }

  return (
    <>
      <AnimalFinanceSummary
        records={records}
        purchasePrice={
          animal.purchase_price || 0
        }
      />

      <AnimalFinanceHistory
        records={records}
      />
    </>
  );
}
