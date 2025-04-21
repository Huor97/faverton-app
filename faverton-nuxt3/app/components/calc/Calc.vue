<script setup lang="ts">
import type { Properties } from '~~/shared/types/address/new-base-address-national';

const props = defineProps<{
  resultSolarEnergy?: string
}>();
const solarEnergy = computed(() => {
  if (!props.resultSolarEnergy) return [];
  return props.resultSolarEnergy[0];
});
const addressProperty = computed<Properties | null>(() => {
  return addressStore.savedAddress?.featureCollection.features[0]?.properties || null;
});
</script>

<template>
  <CalcSimulation
    :address-property
    :solar-energy
  />
  <!-- TODO: ajoute calcSimulationResult -->
</template>
