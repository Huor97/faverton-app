<script setup lang="ts">
import type { AmountEurosPerYear } from '~~/shared/types/amount-euros-per-year';

const props = defineProps<{
  amountPerYear?: AmountEurosPerYear | null
}>();

const amountEurosPerYear = computed<AmountEurosPerYear | null>(() => props.amountPerYear ? props.amountPerYear as AmountEurosPerYear : null);

const savedAddress = useAddressStore();
</script>

<template>
  <div class="bg-blue-50 p-6 rounded-lg shadow-md">
    <div

      class="grid grid-cols-3 gap-4"
    >
      <div class="text-center">
        <h3 class="font-bold flex flex-col text-sm md:text-xl text-blue-600 text-balance">
          <UIcon
            name="i-solar-pie-chart-bold"
            class="h-8 w-8 mx-auto text-blue-600 mb-2"
          />
          <span>
            Production Annuelle
            <UTooltip
              :delay-duration="0"
              text="Quantité produite par kW de panneaux solaires installés"
              content="always"
            >
              PV
            </UTooltip>
            (lieu : {{ savedAddress?.savedAddress?.featureCollection?.features[0]?.properties.postcode }})
          </span>
        </h3>
        <p class=" md:text-2xl font-semibold">
          {{ amountEurosPerYear?.yearlyEnergy?.toFixed(2) }} kWh/kWc
        </p>
      </div>
      <div class="text-center">
        <h3 class="font-bold flex flex-col text-sm md:text-xl text-green-600">
          <UIcon
            name="i-solar-ruler-pen-outline"
            class="h-8 w-8 mx-auto text-green-600 mb-2"
          />
          Surface Toiture
        </h3>
        <p class="md:text-2xl font-semibold">
          {{ amountEurosPerYear?.surfaceArea }} m²
        </p>
      </div>
      <div class="text-center">
        <h3 class="font-bold flex flex-col text-sm md:text-xl text-emerald-600">
          <UIcon
            name="i-solar-wallet-money-linear"
            class="h-8 w-8 mx-auto text-green-600 mb-2"
          />
          Revenus annuels estimés
        </h3>
        <p class="md:text-2xl font-semibold">
          {{ amountEurosPerYear?.amountEurosPerYear?.toFixed(2) }} €/an
        </p>
      </div>
    </div>
  </div>
</template>
