<script setup lang="ts">
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { Outputs } from '~/types/potential-solar';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  potentialSolarTotals: Outputs
}>()

const annualPercentage = computed(() => parseFloat((props.potentialSolarTotals?.totals.fixed.E_y/props.potentialSolarTotals?.totals.fixed['H(i)_y']*100).toFixed(2))) 

console.log(annualPercentage.value);

const chartData = {
  labels: [`Potentielle solaire anuelle`, `Éolienne`],
  datasets: [
    {
      backgroundColor: [`#f8c969`, `#00D8FF`],
      data: [annualPercentage.value, 10],
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <ClientOnly>
    <Doughnut
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </ClientOnly>
</template>
