import { useState } from "react";

import {
  deleteFinanceRecord,
} from "../../services/financeService";

export default function FinanceTable({
  records = [],
  onEdit,
  refreshRecords,
}) {
  const [search, setSearch] = useState("");

  const filtered = records.filter((record) => {
    const term = search.toLowerCase();

    return (
      (record.animal?.tag || "")
        .toLowerCase()
        .includes(term) ||
      (record.transaction_type || "")
        .toLowerCase()
        .includes(term) ||
      (record.category || "")
        .toLowerCase()
        .includes(term) ||
      (record.description || "")
        .toLowerCase()
        .includes(term)
    );
  });

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Delete this finance record?"
      )
    )
      return;

    try {
      await deleteFinanceRecord(id);
      refreshRecords();
    } catch (err) {
      alert(err.message);
    }
  }

  const badgeColor = (category) =>
    category === "Income"
      ? "#16A34A"
      : "#DC2626";

  return (
    <div
      style={{
        background: "#FFFFFF",
        padding: 24,
        borderRadius: 16,
        boxShadow:
          "0 8px 20px rgba(15,23,42,.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
            }}
          >
            💰 Finance Records
          </h2>

          <p
            style={{
              color: "#64748B",
            }}
          >
            {filtered.length} Records
          </p>
        </div>

        <input
          placeholder="🔍 Search finance records..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: 12,
            width: 320,
            border:
              "1px solid #CBD5E1",
            borderRadius: 10,
          }}
        />
      </div>

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background:
                  "#16A34A",
                color: "#FFFFFF",
              }}
            >
              <th style={header}>
                Animal
              </th>

              <th style={header}>
                Category
              </th>

              <th style={header}>
                Type
              </th>

              <th style={header}>
                Amount
              </th>

              <th style={header}>
                Date
              </th>

              <th style={header}>
                Description
              </th>

              <th style={header}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    padding: 30,
                    textAlign:
                      "center",
                  }}
                >
                  No finance records found.
                </td>
              </tr>
            ) : (
              filtered.map(
                (record, index) => (
                  <tr
                    key={record.id}
                    style={{
                      background:
                        index % 2
                          ? "#FCFCFC"
                          : "#FFFFFF",
                      borderBottom:
                        "1px solid #E5E7EB",
                    }}
                  >
                    <td style={cell}>
                      🐄{" "}
                      {record.animal
                        ?.tag || "-"}
                    </td>

                    <td style={cell}>
                      <span
                        style={{
                          background:
                            badgeColor(
                              record.category
                            ),
                          color:
                            "#FFFFFF",
                          padding:
                            "6px 12px",
                          borderRadius: 20,
                          fontWeight: 600,
                        }}
                      >
                        {
                          record.category
                        }
                      </span>
                    </td>

                    <td style={cell}>
                      {
                        record.transaction_type
                      }
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

                    <td style={cell}>
                      {
                        record.transaction_date
                      }
                    </td>

                    <td style={cell}>
                      {record.description}
                    </td>

                    <td style={cell}>
                      <button
                        onClick={() =>
                          onEdit(record)
                        }
                        style={
                          editButton
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            record.id
                          )
                        }
                        style={
                          deleteButton
                        }
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                )
              )
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

const editButton = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  cursor: "pointer",
  marginRight: 8,
  fontWeight: 600,
};

const deleteButton = {
  background: "#DC2626",
  color: "#FFFFFF",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  cursor: "pointer",
  fontWeight: 600,
};
