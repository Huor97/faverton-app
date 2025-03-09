<script setup lang="ts">
import type { AmountEurosPerYear } from "~/types/amount-euros-per-year";

const props = defineProps<{
  amountPerYear?: AmountEurosPerYear
}>();

const amountEurosPerYear = computed<AmountEurosPerYear>(() => props.amountPerYear as AmountEurosPerYear);
</script>

<template>
  <div class="bg-blue-50 p-6 rounded-lg shadow-md">
    <div class="grid grid-cols-3 gap-4">
      <div class="text-center">
        <h3 class="font-bold text-xl text-blue-600 text-nowrap">
          🌞 Production Annuelle
        </h3>
        <p class="text-2xl font-semibold">
          {{ amountEurosPerYear.annualKwh.toFixed(2) }} kWh
        </p>
      </div>
      <div class="text-center">
        <h3 class="font-bold text-xl text-green-600">
          📏 Surface
        </h3>
        <p class="text-2xl font-semibold">
          {{ amountEurosPerYear.surfaceArea }} m²
        </p>
      </div>
      <div class="text-center">
        <h3 class="font-bold text-xl text-emerald-600">
          💶 Revenu Estimé
        </h3>
        <p class="text-2xl font-semibold">
          {{ amountEurosPerYear.amountEurosPerYear.toFixed(2) }} €/an
        </p>
      </div>
    </div>
  </div>
</template>
