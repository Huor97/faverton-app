<script setup lang="ts">
import type { FetchError } from 'ofetch';
import type { Properties } from '~~/shared/types/address/new-base-address-national';
import type { AmountEurosPerMonths } from '~~/shared/types/amount-euros-per-months';
import type { AmountEurosPerYear } from '~~/shared/types/amount-euros-per-year';
import type { Simulation, SolarEnergy } from '~~/shared/types/simulation';

const user = useSupabaseUser();

const props = defineProps<{
  addressProperty: Properties | null
  solarEnergy: SolarEnergy | null
}>();

interface SimulationResponse {
  data: {
    simulation_id: string
  }
}
// UI state
const resultSimulation = ref(false);

// Form data
const surface = ref<number>(1);
const selectedModelName = ref<string | null>(null);

// Computed ID values
const solarEnergyId = computed(() => props.solarEnergy?.data.solar_energy_id || null);
const userId = computed(() => user?.value?.id || null);

// Panel data
const { data: allPanels } = await useFetch(`/api/panels`);
const panels = computed(() => allPanels.value || []);

const modelPanel = computed(() => selectedModelName.value);
const { data: onePanel } = await useFetch(`/api/panel`, {
  query: { model: modelPanel },
  watch: [modelPanel],
});

const panelId = computed(() => onePanel.value?.[0]?.panel_id || null);

// Simulation data
const simulationId = ref<string>(``);
const simulation = ref<Simulation | null>(null);
const simulationError = ref<null | FetchError | unknown>(null);

// Query parameters for potential future calculations
const queryParams = computed(() => ({
  surface: surface.value,
  annualKwh: simulation.value?.solar_energy.yearly_energy ?? 0,
  panelEfficiency: simulation.value?.panel.efficiency ?? 0,
}));

const queryParamsMonth = computed(() => ({
  surface: surface.value,
  panelEfficiency: simulation.value?.panel.efficiency ?? 0,
  solarEnergyId: simulation.value?.solar_energy.solar_energy_id ?? null,
}));

const { data: amountPerMonth } = useLazyFetch<AmountEurosPerMonths>(`/api/simulation/price-month`, {
  query: queryParamsMonth,
  watch: [() => simulation.value?.solar_energy.solar_energy_id],
});

const { data: amountPerYear } = useLazyFetch<AmountEurosPerYear>(`/api/simulation/price-year`, {
  query: queryParams,
});

// Form submission handler
async function handleFormSubmit() {
  if (userId.value !== user?.value?.id) {
    navigateTo(`/user/login`);
  }
  try {
    const res = await $fetch<SimulationResponse>(`/api/simulation`, {
      method: `POST`,
      body: {
        solarEnergyId: solarEnergyId.value,
        panelId: panelId.value,
        userId: userId.value,
      },
    });

    simulationId.value = res.data.simulation_id;
    resultSimulation.value = true;

    // Fetch simulation details with the new ID
    const { data, error } = await useFetch(`/api/simulation`, {
      params: { simulationId: simulationId.value },
    });

    simulation.value = data.value.simulation;
    simulationError.value = error.value;
  }
  catch (error) {
    simulationError.value = error;
    console.error(`Simulation submission error:`, error);
  }
}

// Reset simulation view
function resetSimulation() {
  resultSimulation.value = false;
}

// Check if form is valid
const isFormValid = computed(() =>
  !!props.addressProperty
  && !!surface.value
  && !!selectedModelName.value,
);
const info = [
  {
    label: `Quel est le modèle de vos panneaux solaires ? Chaque type de panneau possède un rendement différent, influencé par la technologie utilisée (monocristallin, polycristallin, etc.) et les conditions d'installation. Ce rendement est pris en compte pour estimer précisément votre production d’énergie solaire.`,
    infoBol: `1`,
  },
];
</script>

<template>
  <FavertonCard>
    <h1 class="text-xl text-center p-5 text-white">
      Étapes de l'estimation
    </h1>
    <FavertonBtnCalc />
    <!-- Calc simulation -->
    <div
      v-if="!resultSimulation"
      class="z-[999] m-0 px-6"
    >
      <FavertonInputSearch />
      <FavertonCardInfo
        :label="info[0]?.label"
        :info-bol="info[0]?.infoBol"
      />
      <FavertonSelectMenu :panels />
      <div class="flex gap-5">
        <UButton
          icon="i-heroicons-paint-brush-20-solid"
          label="Lancer la simulation"
          :disabled="!isFormValid"
          @click="handleFormSubmit"
        />
        <FavertonInputSurface v-model="surface" />
      </div>

      <UDivider label="Lancer votre simulation" />

      <div class="p-3 flex gap-2">
        <UButton
          label="Lancer la simulation"
          :disabled="!isFormValid"
          @click="handleFormSubmit"
        />
        <CalcSimulationHistoryButton />
      </div>
    </div>

    <!-- Results Simulation -->
    <div
      v-else
      class="flex flex-col gap-5 p-1"
    >
      <div>
        <UButton
          label="Retour"
          icon="i-heroicons-arrow-left"
          @click="resetSimulation"
        />
      </div>

      <CalcSimulationYearlyAmount :amount-per-year />
      <CalcSimulationMonthlyAmount :amount-per-month="amountPerMonth" />

      <CalcSimulationHistoryButtonRegister
        :simulation-id="simulationId"
        :surface
      />
      <div>
        <CalcSimulationHistoryButton />
      </div>

      <div
        v-if="simulationError"
        class="p-3 text-red-500"
      >
        Une erreur s'est produite lors de la simulation.
      </div>
    </div>
  </FavertonCard>
</template>
