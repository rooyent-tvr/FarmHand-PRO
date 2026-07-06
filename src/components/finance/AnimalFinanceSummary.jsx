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
          value={`R ${Number(
            purchasePrice
          ).toLocaleString()}`}
          color="#2563EB"
        />

        <SummaryCard
          title="Income"
          value={`R ${income.toLocaleString()}`}
          color="#16A34A"
        />

        <SummaryCard
          title="Expenses"
          value={`R ${expenses.toLocaleString()}`}
          color="#DC2626"
        />

        <SummaryCard
          title="Investment"
          value={`R ${investment.toLocaleString()}`}
          color="#F59E0B"
        />

        <SummaryCard
          title="Profit / Loss"
          value={`R ${profit.toLocaleString()}`}
          color={
            profit >= 0
              ? "#16A34A"
              : "#DC2626"
          }
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
        borderLeft: `5px solid ${color}`,
        background: "#F8FAFC",
        borderRadius: 12,
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#64748B",
          marginBottom: 8,
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
