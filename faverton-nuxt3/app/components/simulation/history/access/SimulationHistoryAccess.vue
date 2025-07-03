<script setup lang="ts">
const user = useSupabaseUser();

const { data, refresh } = await useFetch<SimulationResponse>('/api/simulation/history');

const simulations = computed(() => {
  if (!data.value) return [];
  return data.value.simulations.map(sim => ({
    ...sim,
    label: `${sim.solar_energy?.city} • ${sim.surface} m² • ${sim.panel?.model || 'Standard'} • ${Math.round(sim.solar_energy?.yearly_energy || 0).toLocaleString()} kWh/kWc`,
  }));
});
function handleSimulationDeleted() {
  refresh();
}
const authPromptInfo = {
  icon: 'i-heroicons-lock-closed',
  title: ' Accès à votre historique',
  description: 'Pour consulter l\'historique de vos simulations solaires et suivre l\'évolution de vos projets, veuillez vous connecter à votre compte Faverton. Si vous n\'avez pas encore de compte, quelques secondes suffisent pour en créer un.',
};
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6">
    <template v-if="!user">
      <UserAuthPrompt
        :icon="authPromptInfo.icon"
        :title="authPromptInfo.title"
        :description="authPromptInfo.description"
      />
    </template>
    <template v-else>
      <p v-if="simulations.length === 0">
        Aucun historique
      </p>
      <UAccordion
        variant="outline"
        size="xl"
        :items="simulations"
        color="black"
      >
        <template #item="{ item }">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SimulationHistoryCard
              :item
            />
            <div class="mb-10">
              <SimulationHistoryButtonDelete
                :simulation-id="item?.simulation_id"
                @deleted="handleSimulationDeleted"
              />
            </div>
          </div>
        </template>
      </UAccordion>
    </template>
  </div>
</template>
