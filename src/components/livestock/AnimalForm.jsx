import { useEffect, useState } from "react";
import { addAnimal, updateAnimal } from "../../services/livestockService";

export default function AnimalForm({
  refreshAnimals,
  animal = null,
  onSaved,
}) {
  const [form, setForm] = useState({
    tag: "",
    breed: "",
    gender: "Cow",
    weight: "",
    status: "Healthy",
    purchase_date: "",
    purchase_price: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (animal) {
      setForm({
        tag: animal.tag || "",
        breed: animal.breed || "",
        gender: animal.gender || "Cow",
        weight: animal.weight || "",
        status: animal.status || "Healthy",
        purchase_date: animal.purchase_date || "",
        purchase_price: animal.purchase_price || "",
        notes: animal.notes || "",
      });
    }
  }, [animal]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.tag.trim()) {
      alert("Tag Number is required.");
      return;
    }

    if (!form.breed.trim()) {
      alert("Breed is required.");
      return;
    }

    setSaving(true);

    try {
      if (animal) {
        await updateAnimal(animal.id, form);
      } else {
        await addAnimal(form);
      }

      setForm({
        tag: "",
        breed: "",
        gender: "Cow",
        weight: "",
        status: "Healthy",
        purchase_date: "",
        purchase_price: "",
        notes: "",
      });

      if (refreshAnimals) {
        await refreshAnimals();
      }

      if (onSaved) {
        onSaved();
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
        marginBottom: 25,
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>
        {animal ? "Edit Animal" : "Add Animal"}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 15,
        }}
      >
        <input
          name="tag"
          placeholder="Tag Number"
          value={form.tag}
          onChange={handleChange}
        />

        <input
          name="breed"
          placeholder="Breed"
          value={form.breed}
          onChange={handleChange}
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option>Cow</option>
          <option>Bull</option>
          <option>Heifer</option>
          <option>Calf</option>
        </select>

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option>Healthy</option>
          <option>Pregnant</option>
          <option>Sick</option>
          <option>Sold</option>
        </select>

        <input
          type="date"
          name="purchase_date"
          value={form.purchase_date}
          onChange={handleChange}
        />

        <input
          type="number"
          name="purchase_price"
          placeholder="Purchase Price"
          value={form.purchase_price}
          onChange={handleChange}
        />
      </div>

      <textarea
        name="notes"
        rows="4"
        placeholder="Notes..."
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
        disabled={saving}
        type="submit"
        style={{
          marginTop: 20,
          padding: "12px 28px",
          background: "#2E7D32",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving
          ? "Saving..."
          : animal
          ? "Update Animal"
          : "Save Animal"}
      </button>
    </form>
  );
}
