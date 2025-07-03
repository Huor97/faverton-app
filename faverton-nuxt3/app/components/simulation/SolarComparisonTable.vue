<script setup lang="ts">
import ModeExplanationCardTable from './ModeExplanationCardTable.vue';
import { SOLAR_DEFAULTS } from '~~/shared/constants/solar-parameters';

interface JrcParams {
  lat: number
  lon: number
  peakpower: number
  inclination: number
  azimuth: number
}

interface JrcResult {
  yearly_energy: number
  month_1_energy: number
  month_2_energy: number
  month_3_energy: number
  month_4_energy: number
  month_5_energy: number
  month_6_energy: number
  month_7_energy: number
  month_8_energy: number
  month_9_energy: number
  month_10_energy: number
  month_11_energy: number
  month_12_energy: number
}

interface TableRowData {
  id: string
  address: string
  type: string
  efficiency: number
  surface: number
  inc: number
  orient: number
  annuelle: number
  solar_energy_id: string
  selectedPanel: Panel | null
  isModified: boolean
  isLoading?: boolean
  lastUpdated?: Date
  isSavedToDatabase?: boolean
  monthlyEnergy?: number[]
  originalYearlyEnergy?: number
}

const historyStore = useSimulationHistoryStore();

onMounted(async () => {
  await historyStore.fetchHistory();
});

// Récupération des panneaux disponibles
const { data: allPanels } = await useFetch<Panel[]>('/api/panels', {
  server: false,
});

const panels = computed(() => {
  if (!allPanels.value?.length) return [];
  return allPanels.value.map(panel => ({
    ...panel,
    displayLabel: `${panel.model} - rendement ${panel.efficiency}% - ${panel.detail}`,
  }));
});

const jrcCache = new Map<string, JrcResult>();
const pendingRequests = new Map<string, Promise<JrcResult>>();
const geocodeCache = new Map<string, { lat: number, lon: number }>();

const getCoordinatesFromAddress = async (address: string): Promise<{
  lat: number
  lon: number
}> => {
  if (geocodeCache.has(address)) {
    return geocodeCache.get(address)!;
  }

  try {
    const response = await $fetch<Array<{
      lat: string
      lon: string
    }>>('https://nominatim.openstreetmap.org/search', {
      query: {
        q: address,
        format: 'json',
        limit: 1,
        countrycodes: 'fr',
      },
    });

    if (response && response.length > 0 && response[0]) {
      const coords = {
        lat: parseFloat(response[0].lat),
        lon: parseFloat(response[0].lon),
      };
      geocodeCache.set(address, coords);
      return coords;
    }
  }
  catch (error) {
    console.warn('Erreur géocodage:', error);
  }

  return { lat: 48.8566, lon: 2.3522 };
};

const getCacheKey = (params: JrcParams): string => {
  return `${params.lat}_${params.lon}_${params.peakpower}_${params.inclination}_${params.azimuth}`;
};

const fetchJRCData = async (params: JrcParams): Promise<JrcResult> => {
  const cacheKey = getCacheKey(params);

  if (jrcCache.has(cacheKey)) {
    return jrcCache.get(cacheKey)!;
  }

  if (pendingRequests.has(cacheKey)) {
    return await pendingRequests.get(cacheKey)!;
  }

  const internalApiPromise = $fetch<{
    outputs: {
      totals: {
        fixed: {
          E_y: number
          E_m: { [key: number]: number }
        }
      }
    }
  }>('/api/solar-potential/jrc', {
    query: {
      lat: params.lat,
      lon: params.lon,
      angle: params.inclination,
      aspect: params.azimuth,
    },
  }).then((jrcResponse) => {
    const monthlyData = jrcResponse.outputs.totals.fixed.E_m;
    const scaleFactor = 1;

    return {
      yearly_energy: jrcResponse.outputs.totals.fixed.E_y * scaleFactor,
      month_1_energy: (monthlyData[1] || 0) * scaleFactor,
      month_2_energy: (monthlyData[2] || 0) * scaleFactor,
      month_3_energy: (monthlyData[3] || 0) * scaleFactor,
      month_4_energy: (monthlyData[4] || 0) * scaleFactor,
      month_5_energy: (monthlyData[5] || 0) * scaleFactor,
      month_6_energy: (monthlyData[6] || 0) * scaleFactor,
      month_7_energy: (monthlyData[7] || 0) * scaleFactor,
      month_8_energy: (monthlyData[8] || 0) * scaleFactor,
      month_9_energy: (monthlyData[9] || 0) * scaleFactor,
      month_10_energy: (monthlyData[10] || 0) * scaleFactor,
      month_11_energy: (monthlyData[11] || 0) * scaleFactor,
      month_12_energy: (monthlyData[12] || 0) * scaleFactor,
    };
  });

  pendingRequests.set(cacheKey, internalApiPromise);

  try {
    const result = await internalApiPromise;
    jrcCache.set(cacheKey, result);
    pendingRequests.delete(cacheKey);
    return result;
  }
  catch (error) {
    pendingRequests.delete(cacheKey);
    throw error;
  }
};

const simulations = ref<TableRowData[]>([]);

const debounceTimeouts = new Map<string, NodeJS.Timeout>();

const updateJRCDataDebounced = async (simulationId: string, simulation: TableRowData) => {
  if (debounceTimeouts.has(simulationId)) {
    clearTimeout(debounceTimeouts.get(simulationId)!);
  }

  const timeout = setTimeout(async () => {
    try {
      simulation.isLoading = true;

      const estimatedPowerKWc = simulation.surface * (simulation.efficiency / 100) * 0.15;

      const coordinates = await getCoordinatesFromAddress(simulation.address);

      const jrcParams = {
        lat: coordinates.lat,
        lon: coordinates.lon,
        peakpower: estimatedPowerKWc,
        inclination: simulation.inc,
        azimuth: simulation.orient,
      };

      const jrcResult = await fetchJRCData(jrcParams);

      simulation.annuelle = Math.round(jrcResult.yearly_energy);
      simulation.monthlyEnergy = [
        jrcResult.month_1_energy,
        jrcResult.month_2_energy,
        jrcResult.month_3_energy,
        jrcResult.month_4_energy,
        jrcResult.month_5_energy,
        jrcResult.month_6_energy,
        jrcResult.month_7_energy,
        jrcResult.month_8_energy,
        jrcResult.month_9_energy,
        jrcResult.month_10_energy,
        jrcResult.month_11_energy,
        jrcResult.month_12_energy,
      ];
      simulation.lastUpdated = new Date();
      simulation.isSavedToDatabase = false;
    }
    catch (error) {
      console.error('Erreur lors du recalcul JRC temporaire:', error);
    }
    finally {
      simulation.isLoading = false;
      debounceTimeouts.delete(simulationId);
    }
  }, 1500);

  debounceTimeouts.set(simulationId, timeout);
};

// État pour savoir quelle ligne est en cours d'édition
const editingRow = ref<string | null>(null);

// État de pagination
const page = ref(1);
const pageCount = 10; // Nombre d'éléments par page

// Données paginées
const paginatedSimulations = computed(() => {
  const start = (page.value - 1) * pageCount;
  const end = start + pageCount;
  return simulations.value.slice(start, end);
});

watchEffect(() => {
  if (historyStore?.historyList && Array.isArray(historyStore.historyList)) {
    // Toujours synchroniser avec le store, que ce soit pour l'initialisation ou les mises à jour
    const storeIds = new Set(historyStore.historyList.map((sim: SimulationHistory) => sim.simulation_id));
    const currentIds = new Set(simulations.value.map(sim => sim.id));

    // Ajouter les nouvelles simulations du store
    historyStore.historyList.forEach((sim: SimulationHistory) => {
      if (!currentIds.has(sim.simulation_id)) {
        simulations.value.push({
          id: sim.simulation_id,
          address: `${sim.solar_energy?.postal_code || ''} ${sim.solar_energy?.city || ''}`.trim(),
          type: sim.panel?.model || 'N/A',
          efficiency: sim.panel?.efficiency ?? 0,
          surface: sim.surface,
          inc: sim.solar_energy?.tilt_angle ?? SOLAR_DEFAULTS.INCLINATION,
          orient: sim.solar_energy?.azimuth ?? SOLAR_DEFAULTS.AZIMUT,
          annuelle: sim.solar_energy?.yearly_energy ?? 0,
          solar_energy_id: sim.solar_energy_id,
          selectedPanel: sim.panel,
          isModified: false,
          isLoading: false,
          lastUpdated: new Date(),
          isSavedToDatabase: true,
          originalYearlyEnergy: sim.solar_energy?.yearly_energy ?? 0,
        });
      }
    });

    // Supprimer les simulations qui ne sont plus dans le store
    simulations.value = simulations.value.filter(sim => storeIds.has(sim.id));
  }
});

const tableData = computed(() => {
  if (!historyStore?.historyList || !Array.isArray(historyStore.historyList)) {
    return [];
  }

  return paginatedSimulations.value;
});

const batchRequestParams = computed(() => ({
  simulations: tableData.value.map((sim: TableRowData) => ({
    solarEnergyId: sim.solar_energy_id,
    surface: sim.surface,
    panelEfficiency: sim.efficiency,
  })),
}));

const { data: economicsData } = useLazyFetch<Record<string, AmountEurosPerYear>>(
  '/api/simulation/price-year-batch',
  {
    method: 'POST',
    body: batchRequestParams,
    default: () => ({}),
  },
);

const co2Savings = (solarEnergyId: string): number => {
  const simulation = tableData.value.find(s => s.solar_energy_id === solarEnergyId);
  if (!simulation) return 0;

  const emissionFactor = 0.5;
  const annualSavings = simulation.annuelle * emissionFactor / 1000;
  return Math.round(annualSavings * 100) / 100;
};

const calculateDailyProduction = (solarEnergyId: string): number => {
  const simulation = tableData.value.find(s => s.solar_energy_id === solarEnergyId);
  if (!simulation || !simulation.annuelle) return 0;

  // Calcul de la production journalière moyenne (production annuelle / 365 jours)
  const dailyProduction = simulation.annuelle / 365;
  return Math.round(dailyProduction * 10) / 10; // Arrondi à 1 décimale comme dans SimulationHistoryCard
};

const calculateGridSaleIncome = (solarEnergyId: string): number => {
  const simulation = tableData.value.find(s => s.solar_energy_id === solarEnergyId);
  if (!simulation) return 0;

  const electricityPrice = 0.1740;
  const selfConsumptionRate = 0.7;
  const feedInTariff = 0.10;

  const selfConsumptionSavings = simulation.annuelle * selfConsumptionRate * electricityPrice;
  const gridSaleIncome = simulation.annuelle * (1 - selfConsumptionRate) * feedInTariff;

  return Math.round(selfConsumptionSavings + gridSaleIncome);
};

const getInstallationCost = (solarEnergyId: string): number => {
  const economics = economicsData.value?.[solarEnergyId];
  return Math.round(economics?.amountEurosPerYear ?? 0);
};

const calculatePaybackPeriod = (solarEnergyId: string): number => {
  const yearlyEconomies = calculateGridSaleIncome(solarEnergyId);
  const investmentCost = getInstallationCost(solarEnergyId);

  if (yearlyEconomies === 0) return 0;

  const years = investmentCost / yearlyEconomies;
  return Math.round(years);
};

const startEditing = (rowId: string) => {
  editingRow.value = rowId;
};

const stopEditing = () => {
  editingRow.value = null;
};

// Gestion du changement de page avec vérification d'édition
const handlePageChange = (newPage: number) => {
  // Si une édition est en cours, l'arrêter avant de changer de page
  if (editingRow.value) {
    stopEditing();
  }
  page.value = newPage;
};

const updateSimulation = (id: string, field: string, value: string | number | Panel | null) => {
  const index = simulations.value.findIndex(sim => sim.id === id);
  if (index === -1) return;

  const simulation = simulations.value[index];
  if (!simulation) return;

  if (!simulation.originalYearlyEnergy && simulation.annuelle > 0) {
    simulation.originalYearlyEnergy = simulation.annuelle;
  }

  if (field === 'selectedPanel' && value !== null) {
    const panel = value as Panel;
    simulation.selectedPanel = panel;
    simulation.type = panel.model;
    simulation.efficiency = panel.efficiency;
    simulation.isModified = true;
  }
  else if (typeof value === 'number') {
    if (field === 'surface') {
      simulation.surface = value;
      simulation.isModified = true;
    }
    else if (field === 'inc') {
      simulation.inc = value;
      simulation.isModified = true;
    }
    else if (field === 'orient') {
      simulation.orient = value;
      simulation.isModified = true;
    }
    else if (field === 'efficiency') {
      simulation.efficiency = value;
      simulation.isModified = true;
    }
    else if (field === 'annuelle') {
      simulation.annuelle = value;
      simulation.isModified = true;
    }
  }
  else if (typeof value === 'string') {
    // Typage sécurisé pour les champs texte
    if (field === 'address') {
      simulation.address = value;
      simulation.isModified = true;
    }
    else if (field === 'type') {
      simulation.type = value;
      simulation.isModified = true;
    }
  }

  if (['surface', 'inc', 'orient', 'selectedPanel', 'address'].includes(field)) {
    updateJRCDataDebounced(id, simulation);
  }
};

const updatePanel = (rowId: string, panel: Panel) => {
  updateSimulation(rowId, 'selectedPanel', panel);
};

const handleSurfaceInput = (rowId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);
  const MIN_SURFACE = 5;

  if (value < MIN_SURFACE && value !== 0) {
    target.value = MIN_SURFACE.toString();
    updateSimulation(rowId, 'surface', MIN_SURFACE);
  }
  else if (value >= MIN_SURFACE || value === 0) {
    updateSimulation(rowId, 'surface', value);
  }
};

const handleSurfaceBlur = (rowId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);
  const MIN_SURFACE = 5;

  if (value < MIN_SURFACE && value !== 0) {
    target.value = MIN_SURFACE.toString();
    updateSimulation(rowId, 'surface', MIN_SURFACE);
  }
};

const handleInclinationInput = (rowId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  if (value < 0 && value !== 0) {
    target.value = '0';
    updateSimulation(rowId, 'inc', 0);
  }
  else if (value > 90) {
    target.value = '90';
    updateSimulation(rowId, 'inc', 90);
  }
  else if (value >= 0 && value <= 90) {
    updateSimulation(rowId, 'inc', value);
  }
};

const handleInclinationBlur = (rowId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  if (value < 0) {
    target.value = '0';
    updateSimulation(rowId, 'inc', 0);
  }
  else if (value > 90) {
    target.value = '90';
    updateSimulation(rowId, 'inc', 90);
  }
};

const handleOrientationInput = (rowId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  if (value < -180 && value !== 0) {
    target.value = '-180';
    updateSimulation(rowId, 'orient', -180);
  }
  else if (value > 180) {
    target.value = '180';
    updateSimulation(rowId, 'orient', 180);
  }
  else if (value >= -180 && value <= 180) {
    updateSimulation(rowId, 'orient', value);
  }
};

const handleOrientationBlur = (rowId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  if (value < -180) {
    target.value = '-180';
    updateSimulation(rowId, 'orient', -180);
  }
  else if (value > 180) {
    target.value = '180';
    updateSimulation(rowId, 'orient', 180);
  }
};

const resetModifications = (rowId: string) => {
  const simulation = simulations.value.find(s => s.id === rowId);
  if (!simulation || !simulation.originalYearlyEnergy) return;

  simulation.annuelle = simulation.originalYearlyEnergy;
  simulation.isModified = false;
  simulation.isSavedToDatabase = true;
  stopEditing();
};

const items = (row: { id: string, isModified: boolean }) => [
  [{
    label: 'Modifier',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => startEditing(row.id),
  }],
  [{
    label: 'Réinitialiser',
    icon: 'i-heroicons-arrow-path-20-solid',
    click: () => resetModifications(row.id),
    disabled: !row.isModified,
  }],
];

const columns = [
  { key: 'address', label: 'Adresse' },
  { key: 'type', label: 'Type' },
  { key: 'efficiency', label: 'Efficacité (%)' },
  { key: 'surface', label: 'Surface (m²)' },
  { key: 'inc', label: 'Inclinaison (°)' },
  { key: 'orient', label: 'Orientation (°)' },
  { key: 'annuelle', label: 'Production (kWh)' },
  { key: 'dailyProduction', label: 'Moy/jour', sortable: false },
  { key: 'co2Savings', label: 'CO2 économisé', sortable: false },
  { key: 'amountPerYear', label: 'Gains annuels', sortable: false },
  { key: 'yearlyEconomies', label: 'Production valorisée', sortable: false },
  { key: 'paybackPeriod', label: 'Rentabilité', sortable: false },
  { key: 'actions', label: 'Actions' },
];
</script>

<template>
  <div class="p-4 bg-gray-50">
    <ModeExplanationCardTable />
    <UTable
      :rows="tableData"
      :columns="columns"
    >
      <!-- Cellule de type de panneau éditable -->
      <template #type-data="{ row }">
        <div class="flex items-center gap-2">
          <USelectMenu
            v-if="editingRow === row.id"
            :model-value="row.selectedPanel"
            :options="panels"
            placeholder="Sélectionner un panneau"
            size="sm"
            class="w-64"
            option-attribute="displayLabel"
            @update:model-value="(panel) => updatePanel(row.id, panel)"
          />
          <span
            v-else
            :class="{ 'text-blue-600 font-semibold': row.isModified }"
          >
            {{ row.type }}
          </span>
        </div>
      </template>

      <!-- Cellule de surface éditable -->
      <template #surface-data="{ row }">
        <div class="flex items-center gap-2">
          <UInput
            v-if="editingRow === row.id"
            :model-value="row.surface"
            type="number"
            size="sm"
            class="w-20"
            min="5"
            placeholder="min. 5m²"
            @input="(event: Event) => handleSurfaceInput(row.id, event)"
            @blur="(event: Event) => handleSurfaceBlur(row.id, event)"
          />
          <span
            v-else
            :class="{ 'text-blue-600 font-semibold': row.isModified }"
          >
            {{ row.surface }}m²
          </span>
        </div>
      </template>

      <!-- Cellule d'inclinaison éditable -->
      <template #inc-data="{ row }">
        <div class="flex items-center gap-2">
          <UInput
            v-if="editingRow === row.id"
            :model-value="row.inc"
            type="number"
            size="sm"
            class="w-20"
            min="0"
            max="90"
            placeholder="0-90°"
            @input="(event: Event) => handleInclinationInput(row.id, event)"
            @blur="(event: Event) => handleInclinationBlur(row.id, event)"
          />
          <span
            v-else
            :class="{ 'text-blue-600 font-semibold': row.isModified }"
          >
            {{ row.inc }}°
          </span>
        </div>
      </template>

      <!-- Cellule d'orientation éditable -->
      <template #orient-data="{ row }">
        <div class="flex items-center gap-2">
          <UInput
            v-if="editingRow === row.id"
            :model-value="row.orient"
            type="number"
            size="sm"
            class="w-20"
            min="-180"
            max="180"
            placeholder="-180 à 180°"
            @input="(event: Event) => handleOrientationInput(row.id, event)"
            @blur="(event: Event) => handleOrientationBlur(row.id, event)"
          />
          <span
            v-else
            :class="{ 'text-blue-600 font-semibold': row.isModified }"
          >
            {{ row.orient }}°
          </span>
        </div>
      </template>

      <template #annuelle-data="{ row }">
        <div class="flex items-center gap-2">
          <div
            v-if="row.isLoading"
            class="flex items-center gap-1"
          >
            <div class="w-3 h-3 border border-green-500 border-t-transparent rounded-full animate-spin" />
            <span class="text-xs text-gray-500">Calcul JRC...</span>
          </div>
          <div
            v-else
            class="flex items-center gap-1"
          >
            <span :class="{ 'text-blue-600 font-semibold': row.isModified }">
              {{ Math.round(row.annuelle) }} kWh
            </span>
            <span
              v-if="!row.isSavedToDatabase"
              class="text-xs text-orange-600"
              title="Modification temporaire"
            >
              🔬
            </span>
          </div>
        </div>
      </template>

      <template #dailyProduction-data="{ row }">
        <span :class="{ 'text-blue-600 font-semibold': row.isModified }">
          {{ calculateDailyProduction(row.solar_energy_id) }} kWh/jour
        </span>
      </template>

      <template #co2Savings-data="{ row }">
        <span :class="{ 'text-blue-600 font-semibold': row.isModified }">
          {{ co2Savings(row.solar_energy_id) }}kg
        </span>
      </template>

      <template #amountPerYear-data="{ row }">
        <span :class="{ 'text-blue-600 font-semibold': row.isModified }">
          {{ getInstallationCost(row.solar_energy_id) }}€
        </span>
      </template>

      <template #yearlyEconomies-data="{ row }">
        <span :class="{ 'text-blue-600 font-semibold': row.isModified }">
          {{ calculateGridSaleIncome(row.solar_energy_id) }}€/an
        </span>
      </template>

      <template #paybackPeriod-data="{ row }">
        <span :class="{ 'text-blue-600 font-semibold': row.isModified }">
          {{ calculatePaybackPeriod(row.solar_energy_id) }} ans
        </span>
      </template>

      <!-- Actions -->
      <template #actions-data="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            v-if="editingRow === row.id"
            color="green"
            variant="ghost"
            icon="i-heroicons-check-20-solid"
            size="sm"
            @click="stopEditing"
          />
          <UDropdown
            v-else
            :items="items(row)"
          >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
              size="sm"
            />
          </UDropdown>

          <!-- Indicateur de modification -->
          <UIcon
            v-if="row.isModified"
            name="i-heroicons-pencil-square-20-solid"
            class="w-4 h-4 text-blue-500"
          />
        </div>
      </template>
    </UTable>

    <!-- ✅ Pagination -->
    <div
      v-if="simulations.length > pageCount"
      class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="simulations.length"
        @update:model-value="handlePageChange"
      />
    </div>
  </div>
</template>
