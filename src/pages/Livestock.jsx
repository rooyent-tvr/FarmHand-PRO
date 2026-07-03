import { useEffect, useState } from "react";

import PageContainer from "../components/layout/PageContainer";
import LivestockStatsGrid from "../components/livestock/LivestockStatsGrid";
import AnimalForm from "../components/livestock/AnimalForm";
import AnimalModal from "../components/livestock/AnimalModal";
import ViewToggle from "../components/livestock/ViewToggle";
import LivestockView from "../components/livestock/LivestockView";

import { getAnimals } from "../services/livestockService";

export default function Livestock() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("table");

  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  async function loadAnimals() {
    setLoading(true);

    try {
      const data = await getAnimals();
      setAnimals(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
    <PageContainer
      title="🐄 Livestock Management"
      subtitle="Manage all livestock on your farm."
    >
      <LivestockStatsGrid animals={animals} />

      <AnimalForm refreshAnimals={loadAnimals} />

      <ViewToggle
        view={view}
        setView={setView}
      />

      {loading ? (
        <p>Loading livestock...</p>
      ) : (
        <LivestockView
          view={view}
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
    </PageContainer>
  );
}
