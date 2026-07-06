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
        sum +
        Number(record.amount || 0),
      0
    );

  const expenses = records
    .filter(
      (record) =>
        record.category === "Expense"
    )
    .reduce(
      (sum, record) =>
        sum +
        Number(record.amount || 0),
      0
    );

  const profit = income - expenses;

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
        value={`R ${income.toLocaleString()}`}
        icon="💰"
        color="#16A34A"
      />

      <StatCard
        title="Total Expenses"
        value={`R ${expenses.toLocaleString()}`}
        icon="💸"
        color="#DC2626"
      />

      <StatCard
        title="Net Profit"
        value={`R ${profit.toLocaleString()}`}
        icon={
          profit >= 0 ? "📈" : "📉"
        }
        color={
          profit >= 0
            ? "#2563EB"
            : "#DC2626"
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
