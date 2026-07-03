import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageContainer from "../components/layout/PageContainer";

import ProfileHeader from "../components/animalProfile/ProfileHeader";
import AnimalInfo from "../components/animalProfile/AnimalInfo";
import WeightHistory from "../components/animalProfile/WeightHistory";
import HealthHistory from "../components/animalProfile/HealthHistory";
import BreedingHistory from "../components/animalProfile/BreedingHistory";
import FinancialHistory from "../components/animalProfile/FinancialHistory";
import NotesCard from "../components/animalProfile/NotesCard";

import WeightSummary from "../components/weight/WeightSummary";
import WeightChart from "../components/weight/WeightChart";
import WeightAnalytics from "../components/weight/WeightAnalytics";
import WeightEntryModal from "../components/weight/WeightEntryModal";

import { getAnimals } from "../services/livestockService";
import { getWeightHistory } from "../services/weightService";

export default function AnimalProfile() {
  const { id } = useParams();

  const [animal, setAnimal] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [showWeightModal, setShowWeightModal] = useState(false);

  useEffect(() => {
    loadAnimal();
  }, [id]);

  async function loadAnimal() {
    try {
      const animals = await getAnimals();

      const selected = animals.find(
        (a) => String(a.id) === String(id)
      );

      if (!selected) return;

      setAnimal(selected);

      await loadWeightHistory(selected.id);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadWeightHistory(animalId) {
    try {
      const data = await getWeightHistory(animalId);
      setWeightHistory(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  if (!animal) {
    return (
      <PageContainer
        title="Animal Profile"
        subtitle="Loading..."
      >
        <p>Loading animal...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="🐄 Animal Profile"
      subtitle={`Viewing ${animal.tag}`}
    >
      <ProfileHeader animal={animal} />

      <AnimalInfo animal={animal} />

      <WeightSummary
        records={weightHistory}
      />

      <WeightChart
        records={weightHistory}
      />

      <WeightAnalytics
        records={weightHistory}
      />

      <WeightHistory
        records={weightHistory}
        onAddWeight={() =>
          setShowWeightModal(true)
        }
      />

      <HealthHistory records={[]} />

      <BreedingHistory records={[]} />

      <FinancialHistory
        animal={animal}
        transactions={[]}
      />

      <NotesCard animal={animal} />

      <WeightEntryModal
        animal={animal}
        open={showWeightModal}
        onClose={() =>
          setShowWeightModal(false)
        }
        onSaved={() => {
          loadWeightHistory(animal.id);
          setShowWeightModal(false);
        }}
      />
    </PageContainer>
  );
}
