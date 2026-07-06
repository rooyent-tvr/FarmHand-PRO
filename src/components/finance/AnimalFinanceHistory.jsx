export default function AnimalFinanceHistory({
  records = [],
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        boxShadow:
          "0 8px 20px rgba(15,23,42,.08)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
        }}
      >
        📋 Financial History
      </h2>

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#16A34A",
                color: "#FFFFFF",
              }}
            >
              <th style={header}>Date</th>
              <th style={header}>Category</th>
              <th style={header}>Type</th>
              <th style={header}>Description</th>
              <th style={header}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: 30,
                    textAlign: "center",
                    color: "#64748B",
                  }}
                >
                  No finance records found.
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
                <tr
                  key={record.id}
                  style={{
                    background:
                      index % 2 === 0
                        ? "#FFFFFF"
                        : "#F8FAFC",
                    borderBottom:
                      "1px solid #E2E8F0",
                  }}
                >
                  <td style={cell}>
                    {record.transaction_date}
                  </td>

                  <td style={cell}>
                    <span
                      style={{
                        background:
                          record.category ===
                          "Income"
                            ? "#DCFCE7"
                            : "#FEE2E2",
                        color:
                          record.category ===
                          "Income"
                            ? "#166534"
                            : "#991B1B",
                        padding:
                          "6px 12px",
                        borderRadius: 999,
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {record.category}
                    </span>
                  </td>

                  <td style={cell}>
                    {record.transaction_type}
                  </td>

                  <td style={cell}>
                    {record.description ||
                      "-"}
                  </td>

                  <td
                    style={{
                      ...cell,
                      fontWeight: 700,
                      color:
                        record.category ===
                        "Income"
                          ? "#16A34A"
                          : "#DC2626",
                    }}
                  >
                    R{" "}
                    {Number(
                      record.amount
                    ).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const header = {
  padding: 14,
  textAlign: "left",
};

const cell = {
  padding: 14,
};
