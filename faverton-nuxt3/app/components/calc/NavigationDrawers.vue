<script setup lang="ts">
import type { PVGISData } from "~/types/potential-solar";

const props = defineProps<{
  solarPotential?: PVGISData
  solarLoading?: boolean
  surface?: number
}>();

const rail = ref(true);
const drawer = ref(true);

const potentialSolarTotals = computed(() => {
  if (props.solarPotential === undefined) return;
  return props.solarPotential?.outputs;
});

const { data } = await useFetch(`/api/calc/solar-potential/price-year`, {
  params: {
    annualKwh: 1481.69,
    surface: 3,
  },
});

console.log(`fetch potential solar year`, data.value, `surface `, props.surface);
</script>

<template>
  <VNavigationDrawer
    permanent
    location="right"
    :width="50"
  >
    <template #append>
      <VBtn
        :icon="drawer ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        variant="text"
        @click.stop="drawer = !drawer"
      />
    </template>
  </VNavigationDrawer>
  <VNavigationDrawer
    v-model="drawer"
    :width="700"
    location="right"
    :rail="!rail"
    temporary
  >
    <v-divider />

    <div
      v-if="solarLoading"
      class="flex items-center justify-center h-full "
    >
      <VProgressCircular
        color="amber"
        indeterminate
        :size="128"
      />
    </div>

    <template v-else>
      <VList
        v-if="!potentialSolarTotals"
        density="compact"
        nav
      >
        <VListItem>
          Il faut saisir une address dans le chemps de recherch et le surface :)
        </VListItem>
      </VList>

      <VList
        v-else
        density="compact"
        nav
      >
        <VListItem>
          <FavertonDoughnut :potential-solar-totals />
        </VListItem>
      </VList>
    </template>
  </VNavigationDrawer>
</template>
