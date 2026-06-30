function formatCurrency(value) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(Number(value || 0));
}

export default function TransactionTable({
  transactions = [],
  onEdit,
  onDelete,
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 20,
        border: "1px solid #E2E8F0",
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
        overflow: "hidden",
        marginTop: 30,
      }}
    >
      <div
        style={{
          padding: 24,
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            color: "#0F172A",
          }}
        >
          🧾 Transactions
        </h2>

        <p
          style={{
            marginTop: 8,
            color: "#64748B",
          }}
        >
          View all income and expense transactions.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div
          style={{
            padding: 60,
            textAlign: "center",
            color: "#94A3B8",
          }}
        >
          <div style={{ fontSize: 48 }}>💰</div>

          <h3>No Transactions Yet</h3>

          <p>Add your first income or expense above.</p>
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#F8FAFC",
              }}
            >
              <Header>Date</Header>
              <Header>Type</Header>
              <Header>Category</Header>
              <Header>Description</Header>
              <Header>Amount</Header>
              <Header>Payment</Header>
              <Header>Actions</Header>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                style={{
                  borderTop: "1px solid #E2E8F0",
                }}
              >
                <Cell>{transaction.transaction_date}</Cell>

                <Cell>
                  <span
                    style={{
                      background:
                        transaction.type === "Income"
                          ? "#DCFCE7"
                          : "#FEE2E2",

                      color:
                        transaction.type === "Income"
                          ? "#15803D"
                          : "#DC2626",

                      padding: "6px 12px",
                      borderRadius: 999,
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {transaction.type}
                  </span>
                </Cell>

                <Cell>{transaction.category}</Cell>

                <Cell>{transaction.description}</Cell>

                <Cell
                  style={{
                    fontWeight: 700,
                    color:
                      transaction.type === "Income"
                        ? "#16A34A"
                        : "#DC2626",
                  }}
                >
                  {formatCurrency(transaction.amount)}
                </Cell>

                <Cell>{transaction.payment_method}</Cell>

                <Cell>
                  <button
                    onClick={() => onEdit(transaction)}
                    style={editButton}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(transaction.id)}
                    style={deleteButton}
                  >
                    Delete
                  </button>
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Header({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: 18,
        color: "#475569",
      }}
    >
      {children}
    </th>
  );
}

function Cell({ children, style = {} }) {
  return (
    <td
      style={{
        padding: 18,
        ...style,
      }}
    >
      {children}
    </td>
  );
}

const editButton = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  marginRight: 8,
  cursor: "pointer",
};

const deleteButton = {
  background: "#DC2626",
  color: "#FFFFFF",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  cursor: "pointer",
};
