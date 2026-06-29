import { formatCurrency } from "../../utils/currency";

export default function FinancialCard({
  title,
  amount,
  icon,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 4px 15px rgba(0,0,0,.08)",
        minHeight: 130,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              color: "#666",
              fontSize: 14,
            }}
          >
            {title}
          </div>

          <h2
            style={{
              marginTop: 15,
              color: "#1B5E20",
            }}
          >
            {formatCurrency(amount)}
          </h2>
        </div>

        <div
          style={{
            fontSize: 36,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
