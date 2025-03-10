<script setup lang="ts">
import type { Properties } from '~/types/address/new-base-address-national';
import type { AmountEurosPerYear } from '~/types/amount-euros-per-year';
import type { SimulationClass } from '~/types/simulation';
import type { SolarEnergy } from '~/types/solar_energy';

const user = useSupabaseUser();

const props = defineProps<{
  addressProperty: Properties | null
  solarEnergy: SolarEnergy | null
}>();

// UI state
const drawer = ref(true);
const rail = ref(true);
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
const simulationResult = ref(null);
const simulationId = ref(null);
const simulation = ref<SimulationClass | null>(null);
const simulationError = ref(null);

// Query parameters for potential future calculations
const queryParams = computed(() => ({
  annualKwh: simulation.value?.solar_energy.yearly_energy ?? 0,
  surface: surface.value,
  panelEfficiency: simulation.value?.panel.efficiency ?? 0,
}));

const { data: amountPerYear } = useLazyFetch<AmountEurosPerYear>(`/api/simulation/price-year`, {
  query: queryParams,
});

// Panel selection handler
function handlePanelClick(model: string) {
  selectedModelName.value = model;
}

// Form submission handler
async function handleFormSubmit() {
  try {
    const res = await $fetch(`/api/simulation`, {
      method: `POST`,
      body: {
        solarEnergyId: solarEnergyId.value,
        panelId: panelId.value,
        userId: userId.value,
      },
    });

    simulationResult.value = res;
    simulationId.value = res.data.simulation_id;
    resultSimulation.value = true;

    // Fetch simulation details with the new ID
    const { data, error } = await useFetch(`/api/simulation`, {
      query: { simulationId: simulationId.value },
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
  <FavertonMenuNavigationDrawerToggle v-model="drawer" />

  <VNavigationDrawer
    v-model="drawer"
    :width="700"
    location="right"
    :rail="!rail"
    temporary
  >
    <!-- Panel Selection View -->
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
        <p>Il faut choisir votre address et le surface en m2 avec le panel</p>

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
      <div class="p-3">
        <UButton
          label="Lancer la simulation"
          :disabled="!isFormValid"
          @click="handleFormSubmit"
        />
      </div>
    </div>

    <!-- Simulation Results View -->
    <div
      v-else
      class="flex flex-col gap-5"
    >
      <div class="p-3">
        <UButton
          label="Retour"
          icon="i-heroicons-arrow-left"
          @click="resetSimulation"
        />
      </div>

      <CalcSimulationYearlyAmount :amount-per-year />

      <CalcSimulationHistoryButton :simulation-id="simulationId" />
      <div
        v-if="simulationError"
        class="p-3 text-red-500"
      >
        Une erreur s'est produite lors de la simulation.
      </div>
    </div>
  </VNavigationDrawer>
</template>
