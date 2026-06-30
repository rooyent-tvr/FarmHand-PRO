import { useState } from "react";

const incomeCategories = [
  "Livestock Sales",
  "Crop Sales",
  "Milk",
  "Wool",
  "Eggs",
  "Government Grant",
  "Other",
];

const paymentMethods = [
  "Cash",
  "EFT",
  "Card",
  "Bank Transfer",
  "Cheque",
  "Other",
];

export default function IncomeForm({ onSubmit }) {
  const [form, setForm] = useState({
    category: "Livestock Sales",
    description: "",
    amount: "",
    transaction_date: new Date().toISOString().split("T")[0],
    payment_method: "EFT",
    reference: "",
    notes: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await onSubmit({
      ...form,
      type: "Income",
      amount: Number(form.amount),
    });

    setForm({
      category: "Livestock Sales",
      description: "",
      amount: "",
      transaction_date: new Date().toISOString().split("T")[0],
      payment_method: "EFT",
      reference: "",
      notes: "",
    });
  }

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    border: "1px solid #CBD5E1",
    borderRadius: "10px",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>💰 Add Income</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Category</label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={inputStyle}
          >
            {incomeCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Description</label>

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Amount (R)</label>

          <input
            type="number"
            step="0.01"
            required
            name="amount"
            value={form.amount}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Date</label>

          <input
            type="date"
            name="transaction_date"
            value={form.transaction_date}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Payment Method</label>

          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            style={inputStyle}
          >
            {paymentMethods.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Reference</label>

          <input
            name="reference"
            value={form.reference}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Notes</label>

          <textarea
            rows={4}
            name="notes"
            value={form.notes}
            onChange={handleChange}
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            background: "#16A34A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "12px",
            padding: "12px 24px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Save Income
        </button>
      </form>
    </div>
  );
}
