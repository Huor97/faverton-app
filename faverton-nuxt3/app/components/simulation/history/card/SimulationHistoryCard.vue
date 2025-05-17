<script setup lang="ts">
import { useFormatters } from '~/composables/useFormatters';

defineProps<{
  simulation?: SimulationHistoryItem
}>();
// const model = defineModel();
// const { formatDate } = useFormatters();
// function selectedSimulationId(sim: string) {
//   model.value = sim === model.value ? null : sim;
// }
</script>

<template>
  <div
    class="bg-white p-4 rounded-lg shadow cursor-pointer transition-all hover:shadow-md"
    @click="selectedSimulationId(simulationList.id)"
  >
    <!-- <div class="flex justify-between items-center">
      <div>
        <div class="text-lg font-semibold mb-1">
          {{ simulationList?.solar_energy?.postal_code }}
          {{ simulationList?.solar_energy?.city }}
        </div>
        <div class="text-sm text-gray-600">
          {{ formatDate(simulationList.date) }}
        </div>
      </div>
      <div class="text-right">
        <div class="text-sm">
          {{ simulationList?.panel?.model }}
          {{ simulationList?.panel?.panelEfficiency }} %
        </div>
        <div class="text-sm font-medium text-green-600">
          {{ simulationList?.solar_energy?.yearly_energy }} kWh
        </div>
        <div class="text-sm text-gray-500">
          {{ simulationList?.surface }}m²
        </div>
      </div>
    </div> -->
  </div>
</template>
