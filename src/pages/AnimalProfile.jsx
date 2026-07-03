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

import { getAnimals } from "../services/livestockService";

export default function AnimalProfile() {
  const { id } = useParams();

  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    async function loadAnimal() {
      const animals = await getAnimals();

      const selected = animals.find(
        (a) => String(a.id) === id
      );

      setAnimal(selected || null);
    }

    loadAnimal();
  }, [id]);

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

      <WeightHistory records={[]} />

      <HealthHistory records={[]} />

      <BreedingHistory records={[]} />

      <FinancialHistory
        animal={animal}
        transactions={[]}
      />

      <NotesCard animal={animal} />
    </PageContainer>
  );
}
