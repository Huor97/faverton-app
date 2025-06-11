<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import type { AmountEurosPerMonths } from '~~/shared/types/amount-euros-per-months';

const props = defineProps<{
  amountPerMonth?: AmountEurosPerMonths | null
}>();

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const amountEurosPerMonth = computed<AmountEurosPerMonths>(() => props.amountPerMonth as AmountEurosPerMonths);

const hasMonthlyData = computed(() =>
  !!amountEurosPerMonth.value?.monthlyResults
  && amountEurosPerMonth.value.monthlyResults.length > 0,
);

const formatMonthLabel = (month: string): string => {
  const monthAbbreviations: Record<string, string> = {
    Janvier: `Jan`,
    Février: `Fév`,
    Mars: `Mar`,
    Avril: `Avr`,
    Mai: `Mai`,
    Juin: `Jun`,
    Juillet: `Jul`,
    Août: `Aoû`,
    Septembre: `Sep`,
    Octobre: `Oct`,
    Novembre: `Nov`,
    Décembre: `Déc`,
  };

  return monthAbbreviations[month] || month.substring(0, 3);
};

const chartData = computed(() => {
  if (!hasMonthlyData.value) {
    return { labels: [], datasets: [] };
  }
  const monthlyData = amountEurosPerMonth.value.monthlyResults;
  return {
    labels: monthlyData.map(item => formatMonthLabel(item.month)),
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

const { isMobile } = useDevice();

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      bottom: isMobile ? 50 : 40,
      top: 20,
      left: 10,
      right: 10,
    },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: isMobile ? 90 : 45,
        minRotation: isMobile ? 90 : 45,
        font: {
          size: isMobile ? 9 : 10,
        },
        color: `#6B7280`,
      },
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: isMobile ? 9 : 10,
        },
        color: `#6B7280`,
      },
    },
  },
  plugins: {
    legend: {
      position: `top`,
      labels: {
        boxWidth: isMobile ? 10 : 12,
        font: {
          size: isMobile ? 10 : 11,
        },
        padding: 15,
      },
    },
  },
}));
</script>

<template>
  <div
    class="flex items-center h-[50vh] sm:h-[40vh] bg-white rounded-lg shadow p-4"
  >
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
