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

const queryParams = computed(() => ({
  annualKwh: potentialSolarTotals.value?.totals.fixed.E_y ?? 0,
  surface: props.surface,
}));

const { data, status } = useLazyFetch(`/api/calc/solar-potential/price-year`, {
  query: queryParams,
});

const canDisplayGraph = computed(() => {
  return !!props.surface && !!potentialSolarTotals.value && !!data.value;
});
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
      v-if="status === 'pending'"
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
        v-if="!canDisplayGraph"
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
          <VListItem>
            {{ data }}
            <br>
          </VListItem>
        </VListItem>
      </VList>
    </template>
  </VNavigationDrawer>
</template>
