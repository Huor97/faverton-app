<script setup lang="ts">
definePageMeta({
  middleware: [`auth`],
});

const { data, refresh } = await useFetch<SimulationResponse>(`/api/simulation/history`);

const simulations = computed(() => {
  if (!data.value) return [];
  return data.value.simulations;
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">
      Historique des simulations
    </h1>

    <div
      v-for="simulation in simulations"
      :key="simulation.simulation_id"
      class="grid gap-4 mb-8"
    >
      hello
    </div>
  </div>
</template>
