import { formatCurrency } from "../../utils/currency";

export default function RecentPurchases({ animals }) {
  const recent = [...animals]
    .sort(
      (a, b) =>
        new Date(b.purchase_date || 0) -
        new Date(a.purchase_date || 0)
    )
    .slice(0, 5);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Recent Purchases</h3>

      {recent.length === 0 ? (
        <p>No purchases recorded.</p>
      ) : (
        recent.map((animal) => (
          <div
            key={animal.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <strong>{animal.tag}</strong>
              <br />
              <small>{animal.breed}</small>
            </div>

            <div style={{ textAlign: "right" }}>
              <strong>
                {animal.purchase_price
                  ? formatCurrency(animal.purchase_price)
                  : "Not recorded"}
              </strong>
              <br />
              <small>
                {animal.purchase_date || "-"}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
