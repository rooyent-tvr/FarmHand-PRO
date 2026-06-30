import StatCard from "../ui/StatCard";

function formatCurrency(value = 0) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(Number(value));
}

export default function FinanceSummary({
  income = 0,
  expenses = 0,
  profit = 0,
  transactions = [],
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 20,
        marginBottom: 30,
      }}
    >
      <StatCard
        title="Income"
        value={formatCurrency(income)}
        icon="💰"
        color="#16A34A"
      />

      <StatCard
        title="Expenses"
        value={formatCurrency(expenses)}
        icon="💸"
        color="#DC2626"
      />

      <StatCard
        title="Net Profit"
        value={formatCurrency(profit)}
        icon="📈"
        color={profit >= 0 ? "#2563EB" : "#DC2626"}
      />

      <StatCard
        title="Transactions"
        value={transactions.length}
        icon="🧾"
        color="#7C3AED"
      />
    </div>
  );
}
