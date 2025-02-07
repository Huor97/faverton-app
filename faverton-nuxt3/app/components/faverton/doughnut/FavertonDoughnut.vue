<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import type { Outputs } from '~/types/potential-solar';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

defineProps<{
  potentialSolarTotals?: Outputs
}>();

// const annualPercentage = computed(() => parseFloat((props.potentialSolarTotals?.totals.fixed.E_y / props.potentialSolarTotals?.totals.fixed[`H(i)_y`] * 100).toFixed(2)));

const chartData = {
  labels: [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`],
  datasets: [{
    label: `données mensuelle`,
    data: [10, 20, 12, 3, 10, 20, 12, 34, 10, 20, 12, 3],
    backgroundColor: [
      `rgba(255, 99, 132, 0.6)`,
      `rgba(54, 162, 235, 0.6)`,
      `rgba(255, 206, 86, 0.6)`,
      `rgba(75, 192, 192, 0.6)`,
      `rgba(153, 102, 255, 0.6)`,
      `rgba(255, 159, 64, 0.6)`,
      `rgba(255, 99, 132, 0.6)`,
      `rgba(54, 162, 235, 0.6)`,
      `rgba(255, 206, 86, 0.6)`,
      `rgba(75, 192, 192, 0.6)`,
      `rgba(153, 102, 255, 0.6)`,
      `rgba(255, 159, 64, 0.6)`,
    ],
    borderColor: [
      `rgba(255, 99, 132, 1)`,
      `rgba(54, 162, 235, 1)`,
      `rgba(255, 206, 86, 1)`,
      `rgba(75, 192, 192, 1)`,
      `rgba(153, 102, 255, 1)`,
      `rgba(255, 159, 64, 1)`,
      `rgba(255, 99, 132, 1)`,
      `rgba(54, 162, 235, 1)`,
      `rgba(255, 206, 86, 1)`,
      `rgba(75, 192, 192, 1)`,
      `rgba(153, 102, 255, 1)`,
      `rgba(255, 159, 64, 1)`,
    ],
    borderWidth: 1,
  }],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>

<template>
  <ClientOnly>
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </ClientOnly>
</template>
