import { useEffect, useState } from "react";
import { addCrop, updateCrop } from "../../services/cropService";


const inputStyle = {
  height: "48px",
  padding: "12px 14px",
  border: "1px solid #CBD5E1",
  borderRadius: "10px",
  fontSize: "15px",
  width: "100%",
  boxSizing: "border-box",
};

const selectStyle = { ...inputStyle, cursor: "pointer", background: "#fff" };

const textareaStyle = {
  width: "100%",
  minHeight: "120px",
  padding: "14px",
  border: "1px solid #CBD5E1",
  borderRadius: "10px",
  fontSize: "15px",
  boxSizing: "border-box",
  resize: "vertical",
};

const saveButtonStyle = {
  marginTop: 20,
  padding: "14px 32px",
  background: "#2E7D32",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: "15px",
  cursor: "pointer",
};

export default function CropForm({
  crop = null,
  refreshCrops,
  onSaved,
}) {
  const [form, setForm] = useState({
    crop_name: "",
    variety: "",
    field_name: "",
    planting_date: "",
    expected_harvest: "",
    area: "",
    area_unit: "ha",
    status: "Growing",
    expected_yield: "",
    yield_unit: "kg",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (crop) {
      setForm({
        crop_name: crop.crop_name || "",
        variety: crop.variety || "",
        field_name: crop.field_name || "",
        planting_date: crop.planting_date || "",
        expected_harvest: crop.expected_harvest || "",
        area: crop.area || "",
        area_unit: crop.area_unit || "ha",
        status: crop.status || "Growing",
        expected_yield: crop.expected_yield || "",
        yield_unit: crop.yield_unit || "kg",
        notes: crop.notes || "",
      });
    }
  }, [crop]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.crop_name.trim()) {
      alert("Crop name is required");
      return;
    }

    setSaving(true);

    try {
      if (crop) {
        await updateCrop(crop.id, form);
      } else {
        await addCrop(form);
      }

      setForm({
        crop_name: "",
        variety: "",
        field_name: "",
        planting_date: "",
        expected_harvest: "",
        area: "",
        area_unit: "ha",
        status: "Growing",
        expected_yield: "",
        yield_unit: "kg",
        notes: "",
      });

      if (refreshCrops) await refreshCrops();
      if (onSaved) onSaved();

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
        {crop ? "Edit Crop" : "Add Crop"}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 15,
        }}
      >
        <input
          style={inputStyle}
          name="crop_name"
          placeholder="Crop Name"
          value={form.crop_name}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          name="variety"
          placeholder="Variety"
          value={form.variety}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          name="field_name"
          placeholder="Field Name"
          value={form.field_name}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          type="date"
          name="planting_date"
          value={form.planting_date}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          type="date"
          name="expected_harvest"
          value={form.expected_harvest}
          onChange={handleChange}
        />

        <input
          style={inputStyle}
          type="number"
          name="area"
          placeholder="Area"
          value={form.area}
          onChange={handleChange}
        />

        <select
          style={selectStyle}
          name="area_unit"
          value={form.area_unit}
          onChange={handleChange}
        >
          <option value="ha">ha</option>
          <option value="acres">acres</option>
        </select>

        <select
          style={selectStyle}
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option>Growing</option>
          <option>Harvested</option>
          <option>Planted</option>
        </select>

        <input
          style={inputStyle}
          type="number"
          name="expected_yield"
          placeholder="Expected Yield"
          value={form.expected_yield}
          onChange={handleChange}
        />

        <select
          style={selectStyle}
          name="yield_unit"
          value={form.yield_unit}
          onChange={handleChange}
        >
          <option value="kg">kg</option>
          <option value="tons">tons</option>
        </select>
      </div>

      <textarea
        style={textareaStyle}
        name="notes"
        placeholder="Notes..."
        value={form.notes}
        onChange={handleChange}
        rows="4"
        
      />

      <button
        type="submit"
        disabled={saving}
        style={saveButtonStyle}
      >
        {saving ? "Saving..." : crop ? "Update Crop" : "Save Crop"}
      </button>
    </form>
  );
}
