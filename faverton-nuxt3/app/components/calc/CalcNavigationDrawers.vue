<script setup lang="ts">
import type { FetchError } from 'ofetch';
import type { Properties } from '~/types/address/new-base-address-national';
import type { AmountEurosPerMonths } from '~/types/amount-euros-per-months';
import type { AmountEurosPerYear } from '~/types/amount-euros-per-year';
import type { Simulation, SolarEnergy } from '~/types/simulation';

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
const solarEnergyId = computed(() => props.solarEnergy?.solar_energy_id || null);
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
  annualKwh: simulation.value?.solar_energy.yearly_energy ?? 0,
  surface: surface.value,
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

// Panel selection handler
function handlePanelClick(model: string) {
  selectedModelName.value = model;
}

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
</script>

<template>
  <!-- Panel Selection View -->
  <div class="fixed z-[900] bg-white right-0 border h-full">
    <div v-if="!resultSimulation">
      <div class="z-[999] m-0 p-3 flex gap-3">
        <FavertonInputSearch />
        <FavertonInputSurface v-model="surface" />
      </div>
      <!-- Panel Selection List -->
      <div class="h-full overflow-auto max-h-80">
        <h1 class="m-3 text-xl">
          Choisi votre panel:
        </h1>
        <div
          v-for="panel in panels"
          :key="panel"
        >
          <FavertonImagePanel
            :panel
            @panel-clicked="handlePanelClick"
          />
        </div>
      </div>

      <UDivider label="Afficher votre choix" />

      <!-- Selection Summary -->
      <div class="p-3">
        <p>Si vous êtes connecté, vous devez choisir votre adresse et la surface en m² avec le panel.</p>

        <div class="mt-3">
          <div v-if="addressProperty">
            <p>Adresse: {{ addressProperty.postcode }}, {{ addressProperty.city }}</p>
          </div>
          <div>
            <p>Surface en m²: {{ surface }}</p>
          </div>
          <div v-if="selectedModelName">
            <p>Panneau: {{ selectedModelName }}</p>
          </div>
        </div>
      </div>
      <!-- Submit Button -->
      <div class="p-3 flex gap-2">
        <UButton
          label="Lancer la simulation"
          :disabled="!isFormValid"
          @click="handleFormSubmit"
        />
        <CalcSimulationHistoryButton />
      </div>
    </div>

    <!-- Simulation Results View -->
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
  </div>
</template>
