import { useEffect, useState } from "react";

import PageContainer from "../components/layout/PageContainer";
import FinanceSummary from "../components/finance/FinanceSummary";
import IncomeForm from "../components/finance/IncomeForm";
import ExpenseForm from "../components/finance/ExpenseForm";
import TransactionTable from "../components/finance/TransactionTable";

import {
  getFinanceSummary,
  addTransaction,
  deleteTransaction,
} from "../services/financeService";

export default function Finance() {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    profit: 0,
    transactions: [],
  });

  const [loading, setLoading] = useState(true);

  async function loadFinance() {
    try {
      const data = await getFinanceSummary();
      setSummary(data);
    } catch (error) {
      console.error("Finance Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFinance();
  }, []);

  async function handleAdd(transaction) {
    try {
      await addTransaction(transaction);
      await loadFinance();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await deleteTransaction(id);
      await loadFinance();
    } catch (error) {
      alert(error.message);
    }
  }

  function handleEdit(transaction) {
    console.log("Edit transaction:", transaction);

    // Editing will be added in Sprint 8.3
  }

  if (loading) {
    return (
      <PageContainer
        title="💰 Finance"
        subtitle="Loading finance data..."
      >
        Loading...
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="💰 Finance"
      subtitle="Manage your farm income and expenses."
    >
      <FinanceSummary
        income={summary.income}
        expenses={summary.expenses}
        profit={summary.profit}
        transactions={summary.transactions}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: 24,
          marginBottom: 30,
        }}
      >
        <IncomeForm onSubmit={handleAdd} />
        <ExpenseForm onSubmit={handleAdd} />
      </div>

      <TransactionTable
        transactions={summary.transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
}
