<script setup lang="ts">
import type { AmountEurosPerYear } from '~~/shared/types/amount-euros-per-year';

const props = defineProps<{
  item: SimulationHistory
}>();

const co2Savings = computed(() => {
  if (!props.item?.solar_energy?.yearly_energy) return 0;

  const emissionFactor = 0.5;
  const annualSavings = props.item.solar_energy.yearly_energy * emissionFactor / 1000;
  return annualSavings * 10 / 10;
});

const queryParams = computed(() => ({
  solarEnergyId: props.item?.solar_energy?.solar_energy_id ?? 0,
  surface: props.item.surface,
  panelEfficiency: props.item.panel.efficiency ?? 0,
}));

const { data: amountPerYear } = useLazyFetch<AmountEurosPerYear>('/api/simulation/price-year', {
  query: queryParams,
  // key: `amountPerYear-${props.item.solar_energy.postal_code}-${props.item.simulation_date}`,
});

const yearlyEconomies = computed(() => {
  if (!props.item?.solar_energy?.yearly_energy) return 0;
  // Prix moyen de l'électricité en France (€/kWh)
  const electricityPrice = 0.1740;
  // Taux d'autoconsommation estimé (pourcentage de l'électricité produite qui est consommée)
  const selfConsumptionRate = 0.7; // 70%
  // Tarif de rachat pour le surplus
  const feedInTariff = 0.10; // 10 centimes/kWh
  const selfConsumptionSavings = props.item.solar_energy.yearly_energy * selfConsumptionRate * electricityPrice;
  const gridSaleIncome = props.item.solar_energy.yearly_energy * (1 - selfConsumptionRate) * feedInTariff;

  return Math.round(selfConsumptionSavings + gridSaleIncome);
});

// Temps de retour sur investissement (en années)
const paybackPeriod = computed(() => {
  if (!yearlyEconomies.value || yearlyEconomies.value === 0 || !amountPerYear.value) return 0;

  const years = amountPerYear.value.amountEurosPerYear / yearlyEconomies.value;
  return Math.round(years * 10) / 10;
});

const ItemLabels = [
  {
    title: 'Panneau solaire',
    type: ['Type', ' Efficacité', ' Marque'],
    background: 'bg-green-50',
  },
  {
    title: 'Installation',
    type: ['Surface', ' Orientation', ' Inclinaison'],
    background: 'bg-blue-50',
  },
  {
    title: 'Production',
    type: ['Production annuelle PV', ' Moyenne journalière PV', ' CO2 économisé'],
    background: 'bg-yellow-50',
  },
  {
    title: 'Financier',
    type: ['Gains annuels', ' Production valorisée', 'Rentabilité'],
    background: 'bg-purple-50',
  },
];

const getValueForType = (title: string, index: number) => {
  if (!props.item) return '--';

  switch (title) {
    case 'Panneau solaire':
      switch (index) {
        case 0: return props.item.panel.model || '--';
        case 1: return props.item.panel.efficiency ? `${props.item.panel.efficiency}%` : '--';
        case 2: return props.item.panel.company || '--';
        default: return '--';
      }
    case 'Installation':
      switch (index) {
        case 0: return props.item.surface ? `${props.item.surface} m²` : '--';
        case 1: return props.item?.solar_energy?.azimuth !== undefined && props.item?.solar_energy?.azimuth !== null ? `${props.item?.solar_energy?.azimuth}°` : '--';
        case 2: return props.item?.solar_energy?.tilt_angle !== undefined && props.item?.solar_energy?.tilt_angle !== null ? `${props.item.solar_energy.tilt_angle}°` : '--';
        default: return '--';
      }
    case 'Production':
      switch (index) {
        case 0: return props.item?.solar_energy?.yearly_energy
          ? `${Math.round(props.item.solar_energy.yearly_energy)} kWh/kWc`
          : '--';
        case 1: return props.item?.solar_energy?.yearly_energy ? `${(props.item.solar_energy.yearly_energy / 365).toFixed(1)} kWh/kWc` : '--';
        case 2: return co2Savings.value ? `${(co2Savings.value).toFixed(2)} kg` : '--';
        default: return '--';
      }
    case 'Financier':
      switch (index) {
        case 0: return amountPerYear.value ? `${Math.round(amountPerYear.value.amountEurosPerYear)} €` : '--';
        case 1: return yearlyEconomies.value ? `${yearlyEconomies.value} €/an` : '--';
        case 2: return paybackPeriod.value ? `${Math.round(paybackPeriod.value)} ans` : '--';
        default: return '--';
      }
    default:
      return '--';
  }
};
</script>

<template>
  <div
    v-for="itemLabel in ItemLabels"
    :key="itemLabel.title"
  >
    <div
      class="border rounded-lg p-4"
      :class="itemLabel.background"
    >
      <h3 class="text-lg text-black font-semibold mb-4 pb-2 border-b border-gray-200">
        {{ itemLabel.title }}
      </h3>
      <div
        class="grid grid-cols-2 gap-2"
      >
        <template
          v-for="(type, index) in itemLabel.type"
          :key="type"
        >
          <p class="text-gray-800">
            {{ type }}
          </p>
          <p class="text-gray-800">
            {{ getValueForType(itemLabel.title, index) }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
