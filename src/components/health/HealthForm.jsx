import { useEffect, useState } from "react";
import {
  addHealthRecord,
  updateHealthRecord,
  getAnimals,
} from "../../services/healthService";

export default function HealthForm({
  refreshRecords,
  record = null,
  onSaved,
}) {
  const [animals, setAnimals] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    animal_id: "",
    treatment_type: "Vaccination",
    medication: "",
    treatment_date: "",
    next_due: "",
    veterinarian: "",
    cost: "",
    notes: "",
  });

  useEffect(() => {
    loadAnimals();
  }, []);

  useEffect(() => {
    if (record) {
      setForm({
        animal_id: record.animal_id || "",
        treatment_type: record.treatment_type || "Vaccination",
        medication: record.medication || "",
        treatment_date: record.treatment_date || "",
        next_due: record.next_due || "",
        veterinarian: record.veterinarian || "",
        cost: record.cost || "",
        notes: record.notes || "",
      });
    }
  }, [record]);

  async function loadAnimals() {
    try {
      const data = await getAnimals();
      setAnimals(data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.animal_id) {
      alert("Please select an animal.");
      return;
    }

    if (!form.treatment_date) {
      alert("Treatment date is required.");
      return;
    }

    setSaving(true);

    try {
      if (record) {
        await updateHealthRecord(record.id, form);
      } else {
        await addHealthRecord(form);
      }

      if (refreshRecords) await refreshRecords();
      if (onSaved) onSaved();

      if (!record) {
        setForm({
          animal_id: "",
          treatment_type: "Vaccination",
          medication: "",
          treatment_date: "",
          next_due: "",
          veterinarian: "",
          cost: "",
          notes: "",
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }

    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        padding: 25,
        borderRadius: 12,
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <h2>{record ? "Edit Health Record" : "Animal Health Record"}</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 15,
        }}
      >
        <select
          name="animal_id"
          value={form.animal_id}
          onChange={handleChange}
        >
          <option value="">Select Animal</option>

          {animals.map((animal) => (
            <option key={animal.id} value={animal.id}>
              {animal.tag} - {animal.animal_type} - {animal.breed}
            </option>
          ))}
        </select>

        <select
          name="treatment_type"
          value={form.treatment_type}
          onChange={handleChange}
        >
          <option>Vaccination</option>
          <option>Deworming</option>
          <option>Medication</option>
          <option>Treatment</option>
          <option>Veterinary Visit</option>
        </select>

        <input
          name="medication"
          placeholder="Medication"
          value={form.medication}
          onChange={handleChange}
        />

        <input
          type="date"
          name="treatment_date"
          value={form.treatment_date}
          onChange={handleChange}
        />

        <input
          type="date"
          name="next_due"
          value={form.next_due}
          onChange={handleChange}
        />

        <input
          name="veterinarian"
          placeholder="Veterinarian"
          value={form.veterinarian}
          onChange={handleChange}
        />

        <input
          type="number"
          step="0.01"
          name="cost"
          placeholder="Cost"
          value={form.cost}
          onChange={handleChange}
        />
      </div>

      <textarea
        name="notes"
        rows="4"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        style={{
          width: "100%",
          marginTop: 15,
          padding: 10,
          borderRadius: 8,
          boxSizing: "border-box",
        }}
      />

      <button
        type="submit"
        disabled={saving}
        style={{
          marginTop: 20,
          padding: "12px 28px",
          background: "#2E7D32",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {saving ? "Saving..." : record ? "Update Record" : "Save Record"}
      </button>
    </form>
  );
}
