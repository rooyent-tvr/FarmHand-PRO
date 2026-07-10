import StatCard from "../ui/StatCard";

export default function FinanceStats({
  records = [],
}) {
  const income = records
    .filter(
      (record) =>
        record.category === "Income"
    )
    .reduce(
      (sum, record) =>
        sum + Number(record.amount || 0),
      0
    );

  const expenses = records
    .filter(
      (record) =>
        record.category === "Expense"
    )
    .reduce(
      (sum, record) =>
        sum + Number(record.amount || 0),
      0
    );

  const profit = income - expenses;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(240px,1fr))",
        gap: 20,
        marginBottom: 25,
      }}
    >
      <StatCard
        title="Total Income"
        value={formatCurrency(income)}
        icon="💰"
        color="#16A34A"
      />

      <StatCard
        title="Total Expenses"
        value={formatCurrency(expenses)}
        icon="💸"
        color="#DC2626"
      />

      <StatCard
        title="Net Profit"
        value={formatCurrency(profit)}
        icon={
          profit >= 0
            ? "📈"
            : profit < 0
            ? "📉"
            : "➖"
        }
        color={
          profit > 0
            ? "#16A34A"
            : profit < 0
            ? "#DC2626"
            : "#64748B"
        }
      />

      <StatCard
        title="Transactions"
        value={records.length}
        icon="🧾"
        color="#F59E0B"
      />
    </div>
  );
}
