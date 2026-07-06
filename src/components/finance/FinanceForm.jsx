import { useEffect, useState } from "react";

import {
  addFinanceRecord,
  updateFinanceRecord,
} from "../../services/financeService";

import {
  getAnimals,
} from "../../services/livestockService";

const initialState = {
  animal_id: "",
  category: "Expense",
  transaction_type: "Feed",
  amount: "",
  transaction_date: new Date()
    .toISOString()
    .split("T")[0],
  description: "",
};

export default function FinanceForm({
  record = null,
  refreshRecords,
  onSaved,
}) {
  const [form, setForm] = useState(initialState);
  const [animals, setAnimals] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAnimals();
  }, []);

  useEffect(() => {
    if (record) {
      setForm({
        ...record,
      });
    } else {
      setForm(initialState);
    }
  }, [record]);

  async function loadAnimals() {
    try {
      const data = await getAnimals();
      setAnimals(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    try {
      if (record) {
        await updateFinanceRecord(
          record.id,
          form
        );
      } else {
        await addFinanceRecord(form);
      }

      await refreshRecords();

      if (onSaved) {
        onSaved();
      }

      setForm(initialState);
    } catch (err) {
      alert(err.message);
    }

    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={card}
    >
      <h2 style={title}>
        💰{" "}
        {record
          ? "Edit Finance Record"
          : "Add Finance Record"}
      </h2>

      {/* Row 1 */}

      <div style={grid3}>
        <div>
          <label style={label}>
            Animal
          </label>

          <select
            name="animal_id"
            value={form.animal_id}
            onChange={handleChange}
            style={input}
            required
          >
            <option value="">
              Select Animal
            </option>

            {animals.map((animal) => (
              <option
                key={animal.id}
                value={animal.id}
              >
                🐄 {animal.tag} • {animal.breed}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={label}>
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={input}
          >
            <option value="Expense">
              💸 Expense
            </option>

            <option value="Income">
              💰 Income
            </option>
          </select>
        </div>

        <div>
          <label style={label}>
            Transaction Type
          </label>

          <select
            name="transaction_type"
            value={form.transaction_type}
            onChange={handleChange}
            style={input}
          >
            <option>Purchase</option>
            <option>Feed</option>
            <option>Veterinary</option>
            <option>Medication</option>
            <option>Breeding</option>
            <option>Equipment</option>
            <option>Labour</option>
            <option>Transport</option>
            <option>Insurance</option>
            <option>Sale</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {/* Row 2 */}

      <div style={grid2}>
        <div>
          <label style={label}>
            Amount (R)
          </label>

          <input
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            style={input}
            required
          />
        </div>

        <div>
          <label style={label}>
            Transaction Date
          </label>

          <input
            type="date"
            name="transaction_date"
            value={form.transaction_date}
            onChange={handleChange}
            style={input}
            required
          />
        </div>
      </div>

      {/* Description */}

      <div style={{ marginTop: 18 }}>
        <label style={label}>
          Description
        </label>

        <textarea
          rows={4}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add notes about this transaction..."
          style={textarea}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        style={button}
      >
        {saving
          ? "Saving..."
          : record
          ? "💾 Update Record"
          : "💾 Save Record"}
      </button>
    </form>
  );
}

const card = {
  background: "#FFFFFF",
  padding: 28,
  borderRadius: 16,
  boxShadow:
    "0 8px 20px rgba(15,23,42,.08)",
  marginBottom: 24,
};

const title = {
  marginTop: 0,
  marginBottom: 24,
};

const label = {
  display: "block",
  marginBottom: 6,
  fontSize: 13,
  fontWeight: 600,
  color: "#475569",
};

const grid3 = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
  marginTop: 20,
};

const input = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #CBD5E1",
  borderRadius: 10,
  fontSize: 14,
  boxSizing: "border-box",
};

const textarea = {
  width: "100%",
  padding: 14,
  border: "1px solid #CBD5E1",
  borderRadius: 10,
  resize: "vertical",
  fontSize: 14,
  boxSizing: "border-box",
};

const button = {
  marginTop: 24,
  background: "#16A34A",
  color: "#FFFFFF",
  border: "none",
  padding: "14px 28px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 15,
};
