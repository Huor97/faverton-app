<script setup lang="ts">
import type { PVGISData } from "~/types/potential-solar";
import type { AmountEurosPerYear } from "~/types/amount-euros-per-year";

const props = defineProps<{
  solarPotential?: PVGISData
  surface?: number
}>();

const rail = ref(true);
const drawer = ref(true);

const queryParams = computed(() => ({
  annualKwh: props.solarPotential?.outputs.totals.fixed.E_y ?? 0,
  surface: props.surface,
}));

const amountEurosPerYear = computed<AmountEurosPerYear>(() => data.value as AmountEurosPerYear);

const { data, status } = useLazyFetch(`/api/calc/solar-potential/price-year`, {
  query: queryParams,
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
        v-if="!solarPotential"
        density="compact"
        nav
      >
        Il faut saisir une address dans le chemps de recherch et le surface :)
      </VList>

      <VList
        v-else
        density="compact"
        nav
      >
        <FavertonCardYear :amount-euros-per-year />
        {{ amountEurosPerYear }}
        <FavertonBtn
          button="ajouter dans history"
        />
      </VList>
    </template>
  </VNavigationDrawer>
</template>
