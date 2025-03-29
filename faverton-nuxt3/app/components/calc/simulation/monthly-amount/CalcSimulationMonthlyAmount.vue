<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import type { AmountEurosPerMonths } from '~/types/amount-euros-per-months';

const props = defineProps<{
  amountPerMonth?: AmountEurosPerMonths
}>();

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const amountEurosPerMonth = computed<AmountEurosPerMonths>(() => props.amountPerMonth as AmountEurosPerMonths);

const hasMonthlyData = computed(() =>
  !!amountEurosPerMonth.value?.monthlyResults
  && amountEurosPerMonth.value.monthlyResults.length > 0,
);

const chartData = computed(() => {
  if (!hasMonthlyData.value) {
    return { labels: [], datasets: [] };
  }
  const monthlyData = amountEurosPerMonth.value.monthlyResults;
  return {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: `Revenus mensuels (€)`,
        backgroundColor: `#1f398c`,
        data: monthlyData.map(item => item.euros),
      },
      {
        label: `Énergie produite (kWh)`,
        backgroundColor: `#4CAF50`,
        data: monthlyData.map(item => item.energy),
      },
    ],
  };
});

const chartOptions = ref({
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});
</script>

<template>
  <div>
    <Bar
      v-if="hasMonthlyData"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    <div
      v-else
      class="no-data-message"
    >
      Aucune donnée disponible pour afficher le graphique
    </div>
  </div>
</template>
