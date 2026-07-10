export default function AnimalFinanceSummary({
  records = [],
  purchasePrice = 0,
}) {
  const income = records
    .filter((r) => r.category === "Income")
    .reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0
    );

  const expenses = records
    .filter((r) => r.category === "Expense")
    .reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0
    );

  const investment =
    Number(purchasePrice || 0) + expenses;

  const profit = income - investment;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const profitColor =
    profit > 0
      ? "#16A34A"
      : profit < 0
      ? "#DC2626"
      : "#64748B";

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        boxShadow:
          "0 8px 20px rgba(15,23,42,.08)",
        marginBottom: 24,
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 24,
        }}
      >
        💰 Financial Summary
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 18,
        }}
      >
        <SummaryCard
          title="Purchase Price"
          value={formatCurrency(
            purchasePrice
          )}
          color="#2563EB"
        />

        <SummaryCard
          title="Income"
          value={formatCurrency(
            income
          )}
          color="#16A34A"
        />

        <SummaryCard
          title="Expenses"
          value={formatCurrency(
            expenses
          )}
          color="#DC2626"
        />

        <SummaryCard
          title="Investment"
          value={formatCurrency(
            investment
          )}
          color="#F59E0B"
        />

        <SummaryCard
          title="Profit / Loss"
          value={formatCurrency(
            profit
          )}
          color={profitColor}
        />
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `2px solid ${color}`,
        borderRadius: 14,
        padding: 20,
        transition: "0.2s",
        boxShadow:
          "0 4px 12px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#64748B",
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
