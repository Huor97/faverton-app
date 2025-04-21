<script setup lang="ts">
import { useFormatters } from '~/composables/useFormatters';
import type { AmountEurosPerYear } from '~~/shared/types/amount-euros-per-year';
import type { Simulation } from '~~/shared/types/simulation';

const emit = defineEmits([`simulationDeleted`]);

const props = defineProps<{
  selectedSimulation?: Simulation | null
}>();

const model = defineModel<string | null>();

function closeSimulation() {
  model.value = null;
}
function handleSimulationDeleted(deletedId: string) {
  emit(`simulationDeleted`, deletedId);

  closeSimulation();
}

const queryParams = computed(() => ({
  annualKwh: props.selectedSimulation?.solar_energy.yearly_energy ?? 0,
  surface: props.selectedSimulation?.surface,
  panelEfficiency: props.selectedSimulation?.panel.efficiency ?? 0,
}));

const { data: amountPerYear } = useLazyFetch<AmountEurosPerYear>(`/api/simulation/price-year`, {
  query: queryParams,
});

const { formatDate } = useFormatters();

const dailyAverageEnergy = computed(() => {
  if (!props.selectedSimulation?.solar_energy.yearly_energy) return 0;
  return Math.round((props.selectedSimulation.solar_energy.yearly_energy / 365) * 10) / 10;
});

const co2Savings = computed(() => {
  if (!props.selectedSimulation?.solar_energy.yearly_energy) return 0;

  const emissionFactor = 0.5;
  const annualSavings = props.selectedSimulation.solar_energy.yearly_energy * emissionFactor / 1000;
  return Math.round(annualSavings * 10) / 10;
});

const yearlyEconomies = computed(() => {
  if (!props.selectedSimulation?.solar_energy.yearly_energy) return 0;

  // Prix moyen de l'électricité en France (€/kWh)
  const electricityPrice = 0.1740;
  // Taux d'autoconsommation estimé (pourcentage de l'électricité produite qui est consommée)
  const selfConsumptionRate = 0.7; // 70%
  // Tarif de rachat pour le surplus
  const feedInTariff = 0.10; // 10 centimes/kWh
  const selfConsumptionSavings = props.selectedSimulation.solar_energy.yearly_energy * selfConsumptionRate * electricityPrice;
  const gridSaleIncome = props.selectedSimulation.solar_energy.yearly_energy * (1 - selfConsumptionRate) * feedInTariff;

  return Math.round(selfConsumptionSavings + gridSaleIncome);
});

// Temps de retour sur investissement (en années)
const paybackPeriod = computed(() => {
  if (!yearlyEconomies.value || yearlyEconomies.value === 0 || !amountPerYear.value) return 0;

  const years = amountPerYear.value.amountEurosPerYear / yearlyEconomies.value;
  return Math.round(years * 10) / 10; // Arrondi à 1 décimale
});

const simulationDate = computed(() => props.selectedSimulation?.simulation_date ? formatDate(props.selectedSimulation.simulation_date) : ``);
</script>

<template>
  <div>
    <div class="flex justify-between items-start mb-6">
      <div>
        <h2 class="text-xl font-bold">
          <!-- passe la date -->
          Simulation #{{ selectedSimulation?.solar_energy.city }}
        </h2>
        <p class="text-gray-600">
          {{ simulationDate }}
        </p>
        <p class="mt-2">
          {{ selectedSimulation?.solar_energy.postal_code }}
          {{ selectedSimulation?.solar_energy.city }}
        </p>
      </div>
      <button
        class="p-2 text-gray-500 hover:text-gray-700"
        @click="closeSimulation"
      >
        Fermer
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Panneau solaire -->
      <div class="border rounded-lg p-4">
        <h3 class="font-semibold mb-4 pb-2 border-b border-gray-200">
          Panneau solaire
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <p class="text-gray-600">
            Type:
          </p>
          <p>
            {{ selectedSimulation?.panel.model }}
          </p>
          <p class="text-gray-600">
            Efficacité:
          </p>
          <p>
            {{ selectedSimulation?.panel.efficiency }}%
          </p>
          <p class="text-gray-600">
            Marque:
          </p>
          <p>{{ selectedSimulation?.panel.company }}</p>
        </div>
      </div>

      <!-- Installation -->
      <div class="border rounded-lg p-4">
        <h3 class="font-semibold mb-4 pb-2 border-b border-gray-200">
          Installation
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <p class="text-gray-600">
            Surface:
          </p>
          <p>{{ selectedSimulation?.surface }}m²</p>

          <p class="text-gray-600">
            Orientation:
          </p>
          <p>Sud</p>
          <p class="text-gray-600">
            Inclinaison:
          </p>
          <p>
            30°
          </p>
        </div>
      </div>

      <!-- Production -->
      <div class="border rounded-lg p-4">
        <h3 class="font-semibold mb-4 pb-2 border-b border-gray-200">
          Production
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <p class="text-gray-600">
            Production annuelle:
          </p>
          <p>
            {{ selectedSimulation?.solar_energy.yearly_energy }} kWh
          </p>
          <p class="text-gray-600">
            Moyenne journalière:
          </p>
          <p>{{ dailyAverageEnergy }} kWh</p>

          <p class="text-gray-600">
            CO2 économisé:
          </p>
          <p>{{ co2Savings }} tonnes/an</p>
        </div>
      </div>

      <!-- Financier -->
      <div class="border rounded-lg p-4">
        <h3 class="font-semibold mb-4 pb-2 border-b border-gray-200">
          Financier
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <p class="text-gray-600">
            Investissement annuelles:
          </p>
          <p>
            {{ amountPerYear?.amountEurosPerYear.toFixed(2) }}€
          </p>
          <p class="text-gray-600">
            Économies annuelles:
          </p>
          <p>{{ yearlyEconomies }}€</p>
          <p class="text-gray-600">
            Retour sur investissement:
          </p>
          <p>{{ paybackPeriod }} ans</p>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <CalcSimulationHistoryButtonDelete
        :simulation-id="selectedSimulation?.simulation_id"
        @simulation-deleted="handleSimulationDeleted"
      />
    </div>
  </div>
</template>
