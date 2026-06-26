import { useEffect, useState } from "react";
import AnimalForm from "../components/livestock/AnimalForm";
import AnimalTable from "../components/livestock/AnimalTable";
import AnimalModal from "../components/livestock/AnimalModal";
import { getAnimals } from "../services/livestockService";

export default function Livestock() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  async function loadAnimals() {
    setLoading(true);

    try {
      const data = await getAnimals();
      setAnimals(data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAnimals();
  }, []);

  function handleEdit(animal) {
    setSelectedAnimal(animal);
    setShowModal(true);
  }

  function closeModal() {
    setSelectedAnimal(null);
    setShowModal(false);
  }

  return (
    <div>
      <h1>🐄 Livestock Management</h1>

      <p
        style={{
          color: "#666",
          marginBottom: 25,
        }}
      >
        Manage all livestock on your farm.
      </p>

      <AnimalForm refreshAnimals={loadAnimals} />

      {loading ? (
        <p>Loading livestock...</p>
      ) : (
        <AnimalTable
          animals={animals}
          onEdit={handleEdit}
          refreshAnimals={loadAnimals}
        />
      )}

      <AnimalModal
        open={showModal}
        title="Edit Animal"
        onClose={closeModal}
      >
        <AnimalForm
          animal={selectedAnimal}
          refreshAnimals={loadAnimals}
          onSaved={closeModal}
        />
      </AnimalModal>
    </div>
  );
}
