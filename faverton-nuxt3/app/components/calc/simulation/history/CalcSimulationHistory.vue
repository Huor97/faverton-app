<script setup lang="ts">
import type { Simulations } from '~/types/simulation';

const selectedSimulationId = ref(null);

const { data: resultSimulations } = await useFetch<Simulations>(`/api/simulation/history`);

const simulationLists = computed(() => {
  if (!resultSimulations) return [];
  return resultSimulations.value?.simulations.map((simulation) => {
    return {
      id: simulation.simulation_id,
      date: simulation.simulation_date,
      surface: simulation.surface,
      panel: {
        model: simulation.panel.model,
        panelEfficiency: simulation.panel.efficiency,
      },
      solar_energy: {
        city: simulation.solar_energy.city,
        postalCode: simulation.solar_energy.postal_code,
        yearlyEnergy: simulation.solar_energy.yearly_energy,
      },
    };
  });
});

const selectedSimulation = computed(() => {
  if (!selectedSimulationId.value || !resultSimulations.value?.simulations) return null;

  return resultSimulations.value.simulations.find(
    sim => sim.simulation_id === selectedSimulationId.value,
  );
});

// étape 2
// TODO: supprime une history "history vient false"
// étape 3
// TODO: ouvrire une history: la même sur la page simulate
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">
      Historique des simulations
    </h1>
    <div
      v-for="simulationList in simulationLists"
      :key="simulationList.id"
      class="grid gap-4 mb-8"
    >
      <CalcSimulationHistoryCard
        v-model="selectedSimulationId"
        :simulation-list
      />
    </div>

    <div
      v-if="selectedSimulationId"
      class="bg-white p-6 rounded-lg shadow-lg"
    >
      <CalcSimulationHistoryDetails
        v-model="selectedSimulationId"
        :selected-simulation
      />
    </div>
    <div
      v-if="simulationLists?.length === 0"
      class="text-center py-10 text-gray-500"
    >
      Aucune simulation dans l'historique
    </div>
  </div>
</template>
