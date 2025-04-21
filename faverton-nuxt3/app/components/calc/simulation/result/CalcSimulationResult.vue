<script setup lang="ts">
const props = defineProps<{
  propertySimulation: propertySimulationResult | null
}>();
const user = useSupabaseUser();
const amountPerMonth = ref<AmountEurosPerMonths | null>(null);
const amountPerYear = ref<AmountEurosPerYear | null>(null);

const queryParams = computed(() => {
  if (props.propertySimulation === null) return null;
  return {
    surface: props.propertySimulation.surface,
    panelEfficiency: props.propertySimulation.simulation.panel.efficiency,
    solarEnergyId: props.propertySimulation.simulation.solar_energy_id,
  };
});

const getAmount = async () => {
  if (queryParams.value != null) {
    const monthlyData = await $fetch<AmountEurosPerMonths>(`/api/simulation/price-month`, {
      query: queryParams.value,
    });
    if (monthlyData) {
      amountPerMonth.value = monthlyData;
    }

    const yearlyData = await $fetch<AmountEurosPerYear>(`/api/simulation/price-year`, {
      query: queryParams.value,
    });
    if (yearlyData) {
      amountPerYear.value = yearlyData;
    }
  }
};

watch(queryParams, (newParams) => {
  if (newParams) {
    getAmount();
  }
}, { immediate: true });
const isLoading = computed(() => !amountPerYear.value && !amountPerMonth.value);
</script>

<template>
  <div class="flex flex-col gap-5 p-6">
    <FavertonLoading v-if="isLoading" />
    <div
      v-else
      class="flex flex-col gap-5"
    >
      <CalcSimulationYearlyAmount
        v-if="amountPerYear"
        :amount-per-year
      />
      <CalcSimulationMonthlyAmount
        v-if="amountPerMonth"
        :amount-per-month="amountPerMonth"
      />

      <div class="flex justify-center">
        <CalcSimulationHistoryButtonRegister
          v-if="user"
          :simulation-id="propertySimulation?.simulation.simulation_id"
          :surface="propertySimulation?.surface"
        />
      </div>
    </div>
  </div>
</template>
