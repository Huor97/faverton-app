<script setup>
  import { Doughnut } from 'vue-chartjs'
  import { Chart as ChartJS, ArcElement, Tooltip, Legend  } from 'chart.js'
  
ChartJS.register(ArcElement, Tooltip, Legend)

  
  const chartData = {
      labels: ['Potentielle solaire ', 'Éolienne'],
      datasets: [
    {
        backgroundColor: ['#f8c969', '#00D8FF'],
        data: [40, 80]
    }
  ]
  }
  
  const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
  }
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