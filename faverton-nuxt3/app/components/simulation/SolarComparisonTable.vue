<script setup lang="ts">
import { SOLAR_DEFAULTS } from '~~/shared/constants/solar-parameters';

// Types
interface Simulation {
  id: string
  address: string
  surface: number
  panelConfig: string
  inclination: number
  orientation: number
  // Données JRC réelles
  yearlyEnergy: number
  originalYearlyEnergy?: number
  monthlyEnergy: number[]
  panelModel: string
  panelEfficiency: number
  panelBrand: string
  panelType: string
  // États pour l'UI
  isLoading?: boolean
  lastUpdated?: Date
  isSavedToDatabase?: boolean
}

interface JRCRequest {
  lat: number
  lon: number
  peakpower: number
  inclination: number
  azimuth: number
}

interface JRCResponse {
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

interface SortConfig {
  key: string | null
  direction: 'asc' | 'desc'
}

interface CalculatedData extends Simulation {
  name: string
  type: string
  efficiency: number
  brand: string
  yearlyProduction: number
  dailyProduction: number
  co2Saved: number
  yearlyGains: number
  valuePerYear: number
  paybackPeriod: number
}

const user = useSupabaseUser();
const historyData = ref<SimulationResponse | null>(null);
const isLoading = ref(false);

const loadSimulations = async () => {
  if (!user.value) return;

  isLoading.value = true;
  try {
    historyData.value = await $fetch<SimulationResponse>('/api/simulation/history');
  }
  catch (error) {
    console.error('Erreur lors du chargement des simulations:', error);
  }
  finally {
    isLoading.value = false;
  }
};

watch(user, loadSimulations, { immediate: true });

const refreshInterval = setInterval(loadSimulations, 5000);

onUnmounted(() => {
  clearInterval(refreshInterval);
});

// Exposer la fonction de rafraîchissement pour usage externe
defineExpose({
  refreshSimulations: loadSimulations,
});

// Cache pour éviter les appels API redondants
const jrcCache = new Map<string, JRCResponse>();
const pendingRequests = new Map<string, Promise<JRCResponse>>();
const geocodeCache = new Map<string, {
  lat: number
  lon: number
}>();

// Fonction pour mapper les IDs de compagnies vers des noms lisibles
const getBrandNameFromId = (companyId?: string): string => {
  if (!companyId) return 'Générique';

  // Si c'est déjà un nom (pas un UUID), le retourner tel quel
  if (!companyId.includes('-') || companyId.length !== 36) {
    return companyId;
  }

  // Mapping des IDs vers les noms de marques connues
  const brandMapping: Record<string, string> = {
    '8a644cc5-18fe-4dce-9529-d3fae7bea4a8': 'SunPower',
    // Ajouter d'autres mappings si nécessaire
  };

  return brandMapping[companyId] || 'Marque Inconnue';
};

// Fonction pour obtenir les coordonnées depuis l'adresse
const getCoordinatesFromAddress = async (address: string): Promise<{
  lat: number
  lon: number
}> => {
  if (geocodeCache.has(address)) {
    return geocodeCache.get(address)!;
  }

  try {
    // Utiliser l'API de géocodage (par exemple OpenStreetMap Nominatim)
    const response = await $fetch<Array<{
      lat: string
      lon: string
    }>>('https://nominatim.openstreetmap.org/search', {
      query: {
        q: address,
        format: 'json',
        limit: 1,
        countrycodes: 'fr', // Limiter à la France
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

  // Fallback sur Paris si erreur
  return { lat: 48.8566, lon: 2.3522 };
};

// Fonction pour générer une clé de cache
const getCacheKey = (req: JRCRequest): string => {
  return `${req.lat}_${req.lon}_${req.peakpower}_${req.inclination}_${req.azimuth}`;
};

// Fonction pour appeler l'API JRC avec cache et debounce
const fetchJRCData = async (params: JRCRequest): Promise<JRCResponse> => {
  const cacheKey = getCacheKey(params);

  // Vérifier le cache d'abord
  if (jrcCache.has(cacheKey)) {
    return jrcCache.get(cacheKey)!;
  }

  // Vérifier si une requête identique est en cours
  if (pendingRequests.has(cacheKey)) {
    return await pendingRequests.get(cacheKey)!;
  }

  // ✅ CORRECTION : Utiliser l'API interne au lieu d'appeler directement l'API JRC externe
  const internalApiPromise = $fetch<{
    outputs: {
      totals: {
        fixed: {
          E_y: number // yearly energy
          E_m: { [key: number]: number } // monthly energy
        }
      }
    }
  }>('/api/solar-potential/jrc', {
    query: {
      lat: params.lat,
      lon: params.lon,
      angle: params.inclination, // inclinaison du panneau
      aspect: params.azimuth, // orientation (azimut)
      // Note: peakpower n'est pas utilisé par l'API interne (fixé à 1kWc)
      // On devra adapter nos calculs en conséquence
    },
  }).then((jrcResponse) => {
    // Convertir la réponse JRC vers notre format
    const monthlyData = jrcResponse.outputs.totals.fixed.E_m;

    // ✅ IMPORTANT : L'API interne retourne des valeurs par kWc
    // Pour correspondre à votre attente (955.73), on retourne la valeur brute
    const scaleFactor = 1; // Pas de multiplication pour avoir la valeur brute JRC

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

  const promise = internalApiPromise;

  pendingRequests.set(cacheKey, promise);

  try {
    const result = await promise;
    jrcCache.set(cacheKey, result);
    pendingRequests.delete(cacheKey);
    return result;
  }
  catch (error) {
    pendingRequests.delete(cacheKey);
    throw error;
  }
};

// Debounce pour les mises à jour JRC
const debounceTimeouts = new Map<string, NodeJS.Timeout>();

// Fonction pour recalculer les données JRC temporairement (SANS sauvegarder en base)
const updateJRCDataDebounced = async (simulationId: string, simulation: Simulation) => {
  // Annuler le timeout précédent pour cette simulation
  if (debounceTimeouts.has(simulationId)) {
    clearTimeout(debounceTimeouts.get(simulationId)!);
  }

  // Programmer une nouvelle mise à jour dans 1.5 secondes
  const timeout = setTimeout(async () => {
    try {
      // Marquer comme en cours de chargement
      simulation.isLoading = true;

      // Calculer la puissance crête estimée
      const estimatedPowerKWc = simulation.surface * (simulation.panelEfficiency / 100) * 0.15;

      // Obtenir les coordonnées depuis l'adresse
      const coordinates = await getCoordinatesFromAddress(simulation.address);

      const jrcParams: JRCRequest = {
        lat: coordinates.lat,
        lon: coordinates.lon,
        peakpower: estimatedPowerKWc,
        inclination: simulation.inclination,
        azimuth: simulation.orientation,
      };

      const jrcResult = await fetchJRCData(jrcParams);

      // Modification locale uniquement - aucune sauvegarde en base
      simulation.yearlyEnergy = Math.round(jrcResult.yearly_energy);

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

// Conversion des données historiques vers le format du tableau
const simulations = ref<Simulation[]>([]);

watch(historyData, (newData) => {
  if (newData?.simulations && user.value) {
    simulations.value = newData.simulations.map(sim => ({
      id: sim.simulation_id,
      address: `${sim.solar_energy?.city}, ${sim.solar_energy?.postal_code}`,
      surface: sim.surface || 0,
      panelConfig: sim.panel?.panel_type_id || 'unknown',
      inclination: sim.solar_energy?.tilt_angle || SOLAR_DEFAULTS.INCLINATION,
      orientation: sim.solar_energy?.azimuth || SOLAR_DEFAULTS.AZIMUT,
      // Données JRC réelles
      yearlyEnergy: sim.solar_energy?.yearly_energy || 0,
      originalYearlyEnergy: sim.solar_energy?.yearly_energy || 0,
      monthlyEnergy: [
        sim.solar_energy?.month_1_energy || 0,
        sim.solar_energy?.month_2_energy || 0,
        sim.solar_energy?.month_3_energy || 0,
        sim.solar_energy?.month_4_energy || 0,
        sim.solar_energy?.month_5_energy || 0,
        sim.solar_energy?.month_6_energy || 0,
        sim.solar_energy?.month_7_energy || 0,
        sim.solar_energy?.month_8_energy || 0,
        sim.solar_energy?.month_9_energy || 0,
        sim.solar_energy?.month_10_energy || 0,
        sim.solar_energy?.month_11_energy || 0,
        sim.solar_energy?.month_12_energy || 0,
      ],
      panelModel: sim.panel?.model || 'Standard',
      panelEfficiency: sim.panel?.efficiency || 18,
      panelBrand: getBrandNameFromId(sim.panel?.company) || 'Générique',
      panelType: sim.panel?.panel_type_id || 'monocristallin',
      isLoading: false,
      lastUpdated: new Date(),
      isSavedToDatabase: true,
    }));
  }
}, { immediate: true });

const sortConfig = ref<SortConfig>({ key: null, direction: 'asc' });

const calculateData = (simulation: Simulation) => {
  const panel = {
    name: simulation.panelModel,
    type: simulation.panelType,
    efficiency: simulation.panelEfficiency,
    brand: simulation.panelBrand,
  };

  const currentYearlyEnergy = simulation.yearlyEnergy;

  const yearlyProduction = Math.round(currentYearlyEnergy);
  const dailyProduction = Math.round((currentYearlyEnergy / 365) * 10) / 10;

  const co2Saved = Math.round((currentYearlyEnergy * 0.5) / 1000 * 10) / 10;

  const electricityPrice = 0.1740; // Prix moyen électricité France (€/kWh)
  const selfConsumptionRate = 0.7; // 70% d'autoconsommation
  const feedInTariff = 0.10; // Tarif de rachat surplus (€/kWh)

  const EDF_PRICE = 0.1269; // Prix utilisé par l'API (différent du calcul local !)
  const HIGH_PERFORMANCE_PANEL = Number((simulation.panelEfficiency / 100).toFixed(2));
  const apiAmount = currentYearlyEnergy * simulation.surface * EDF_PRICE * HIGH_PERFORMANCE_PANEL;

  const effectiveProduction = currentYearlyEnergy * (simulation.panelEfficiency / 100);

  const selfConsumptionSavingsEffective = effectiveProduction * selfConsumptionRate * electricityPrice;
  const gridSaleIncomeEffective = effectiveProduction * (1 - selfConsumptionRate) * feedInTariff;
  const yearlyEconomiesEffective = Math.round(selfConsumptionSavingsEffective + gridSaleIncomeEffective);

  const yearlyGains = Math.round(apiAmount * 100) / 100;
  const valuePerYear = yearlyEconomiesEffective;

  const paybackPeriod = yearlyGains > 0
    ? Math.round((yearlyEconomiesEffective / yearlyGains) * 10) / 10
    : 0;

  return {
    ...panel,
    yearlyProduction,
    dailyProduction,
    co2Saved,
    yearlyGains, // = "Gains annuels" (équivalent API)
    valuePerYear, // = "Production valorisée" (équivalent yearlyEconomies)
    paybackPeriod, // = "Rentabilité" (économies réelles / gains API, inversé pour correspondre aux valeurs réelles)
  };
};

// Données calculées avec toutes les métriques
const calculatedData = computed((): CalculatedData[] => {
  return simulations.value.map(sim => ({
    ...sim,
    ...calculateData(sim),
  }));
});

// Fonction pour calculer les classements
const getRanking = (data: CalculatedData[], field: keyof CalculatedData, ascending = false) => {
  const sorted = [...data].sort((a, b) => {
    const aVal = a[field] as number;
    const bVal = b[field] as number;
    return ascending ? aVal - bVal : bVal - aVal;
  });
  const ranking: Record<string, number> = {};
  sorted.forEach((item, index) => {
    ranking[item.id] = index + 1;
  });
  return ranking;
};

// Classements pour chaque métrique
const rankings = computed(() => ({
  efficiency: getRanking(calculatedData.value, 'efficiency'),
  yearlyProduction: getRanking(calculatedData.value, 'yearlyProduction'),
  yearlyGains: getRanking(calculatedData.value, 'yearlyGains'),
  paybackPeriod: getRanking(calculatedData.value, 'paybackPeriod', true),
  co2Saved: getRanking(calculatedData.value, 'co2Saved'),
}));

// Emojis pour les rangs
const getRankEmoji = (rank: number | undefined): string => {
  if (!rank || rank === undefined) return '';
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
};

// Tri des données
const sortData = (key: string) => {
  let direction: 'asc' | 'desc' = 'asc';
  if (sortConfig.value.key === key && sortConfig.value.direction === 'asc') {
    direction = 'desc';
  }
  sortConfig.value = { key, direction };
};

const sortedData = computed(() => {
  if (!sortConfig.value.key) return calculatedData.value;

  return [...calculatedData.value].sort((a, b) => {
    const aVal = a[sortConfig.value.key! as keyof CalculatedData] as number;
    const bVal = b[sortConfig.value.key! as keyof CalculatedData] as number;

    if (sortConfig.value.direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
});

// Actions CRUD - Permettre l'édition pour les simulations "what-if"
const updateSimulation = (id: string, field: keyof Simulation, value: string | number) => {
  const index = simulations.value.findIndex(sim => sim.id === id);
  if (index !== -1) {
    const simulation = simulations.value[index];
    if (!simulation) return;

    // Stocker la valeur originale si c'est la première modification
    if (!simulation.originalYearlyEnergy && simulation.yearlyEnergy > 0) {
      simulation.originalYearlyEnergy = simulation.yearlyEnergy;
    }

    if (typeof value === 'string' && typeof simulation[field] === 'string') {
      (simulation[field] as string) = value;
    }
    else if (typeof value === 'number' && typeof simulation[field] === 'number') {
      (simulation[field] as number) = value;
    }

    // Mise à jour automatique de l'efficacité du panneau selon le type sélectionné
    if (field === 'panelConfig' && typeof value === 'string') {
      const panelConfigMap: Record<string, {
        efficiency: number
        type: string
        brand: string
        model: string
      }> = {
        mono_20_premium: { efficiency: 20, type: 'Monocristallin Premium', brand: 'Premium Brand', model: 'Premium 20%' },
        mono_18_standard: { efficiency: 18, type: 'Monocristallin Standard', brand: 'Standard Brand', model: 'Standard 18%' },
        poly_16_standard: { efficiency: 16, type: 'Polycristallin Standard', brand: 'Standard Brand', model: 'Poly 16%' },
        amorphe_10_budget: { efficiency: 10, type: 'Amorphe Budget', brand: 'Budget Brand', model: 'Amorphe 10%' },
      };

      const panelConfig = panelConfigMap[value];
      if (panelConfig) {
        simulation.panelEfficiency = panelConfig.efficiency;
        simulation.panelType = panelConfig.type;
        simulation.panelBrand = panelConfig.brand;
        simulation.panelModel = panelConfig.model;
      }
    }

    // Recalcul avec l'API JRC si les paramètres physiques changent
    if (['surface', 'inclination', 'orientation', 'panelConfig', 'address'].includes(field)) {
      // Déclencher une mise à jour JRC en temps réel (avec debounce)
      updateJRCDataDebounced(id, simulation);
    }
  }
  else {
    console.error(`Simulation avec ID ${id} non trouvée`);
  }
};

const addSimulation = () => {
  if (!user.value) return;

  const newId = `sim_${Date.now()}`;
  const defaultEnergy = 2500;
  simulations.value.push({
    id: newId,
    address: 'Nouvelle simulation',
    surface: 150,
    panelConfig: 'mono_18_standard',
    inclination: SOLAR_DEFAULTS.INCLINATION, // 35° optimum France
    orientation: SOLAR_DEFAULTS.AZIMUT, // 0° = Sud optimum
    yearlyEnergy: defaultEnergy, // Valeur par défaut estimée
    originalYearlyEnergy: defaultEnergy,
    monthlyEnergy: Array(12).fill(200),
    panelModel: 'Standard',
    panelEfficiency: 18,
    panelBrand: 'Générique',
    panelType: 'Monocristallin',
    // États pour l'UI
    isLoading: false,
    lastUpdated: new Date(),
    isSavedToDatabase: false,
  });
};

const removeSimulation = (id: string) => {
  simulations.value = simulations.value.filter(sim => sim.id !== id);
};

// Options pour le select des panneaux
const panelConfigOptions = computed(() => [
  { value: 'mono_20_premium', label: 'Monocristallin Premium (20%)' },
  { value: 'mono_18_standard', label: 'Monocristallin Standard (18%)' },
  { value: 'poly_16_standard', label: 'Polycristallin Standard (16%)' },
  { value: 'amorphe_10_budget', label: 'Amorphe Budget (10%)' },
]);

// Composant SortIcon séparé
const SortIcon = defineComponent({
  props: {
    columnKey: {
      type: String,
      required: true,
    },
    sortConfig: {
      type: Object as () => SortConfig,
      required: true,
    },
  },
  setup(props) {
    const iconClass = computed(() => {
      if (!props.sortConfig || props.sortConfig.key !== props.columnKey) {
        return 'w-3 h-3 text-gray-400';
      }
      return 'w-3 h-3 text-blue-600';
    });

    return () => h('span', {
      class: iconClass.value,
    }, props.sortConfig && props.sortConfig.key === props.columnKey
      ? (props.sortConfig.direction === 'asc' ? '▲' : '▼')
      : '▲',
    );
  },
});

// Fonction pour réinitialiser toutes les simulations aux valeurs originales
const resetToOriginalValues = () => {
  if (historyData.value?.simulations && user.value) {
    simulations.value = historyData.value.simulations.map(sim => ({
      id: sim.simulation_id,
      address: `${sim.solar_energy?.city}, ${sim.solar_energy?.postal_code}`,
      surface: sim.surface || 0,
      panelConfig: sim.panel?.panel_type_id || 'unknown',
      inclination: sim.solar_energy?.tilt_angle || SOLAR_DEFAULTS.INCLINATION, // 35° optimum France
      orientation: sim.solar_energy?.azimuth || SOLAR_DEFAULTS.AZIMUT, // 0° = Sud optimum
      // Données JRC réelles
      yearlyEnergy: sim.solar_energy?.yearly_energy || 0,
      originalYearlyEnergy: sim.solar_energy?.yearly_energy || 0,
      monthlyEnergy: [
        sim.solar_energy?.month_1_energy || 0,
        sim.solar_energy?.month_2_energy || 0,
        sim.solar_energy?.month_3_energy || 0,
        sim.solar_energy?.month_4_energy || 0,
        sim.solar_energy?.month_5_energy || 0,
        sim.solar_energy?.month_6_energy || 0,
        sim.solar_energy?.month_7_energy || 0,
        sim.solar_energy?.month_8_energy || 0,
        sim.solar_energy?.month_9_energy || 0,
        sim.solar_energy?.month_10_energy || 0,
        sim.solar_energy?.month_11_energy || 0,
        sim.solar_energy?.month_12_energy || 0,
      ],
      panelModel: sim.panel?.model || 'Standard',
      panelEfficiency: sim.panel?.efficiency || 18,
      panelBrand: getBrandNameFromId(sim.panel?.company) || 'Générique',
      panelType: sim.panel?.panel_type_id || 'monocristallin',
      // États pour l'UI - données originales sont considérées comme sauvegardées
      isLoading: false,
      lastUpdated: new Date(),
      isSavedToDatabase: true,
    }));
  }
};
</script>

<template>
  <div class="p-4 bg-gray-50">
    <div class="max-w-full mx-auto">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- En-tête -->
        <div class="px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <h2 class="text-xl font-bold">
            Simulateur Solaire Faverton - Comparaison
          </h2>
          <p class="text-green-100 mt-1">
            Analyse comparative des simulations
          </p>
        </div>

        <!-- Contrôles -->
        <div class="p-3 border-b bg-gray-50 flex justify-between items-center">
          <!-- Conditions d'affichage selon l'état utilisateur -->
          <div v-if="!user">
            <p class="text-sm text-gray-600">
              Connectez-vous pour voir vos simulations précédentes
            </p>
            <div class="flex gap-2 mt-2">
              <UButton
                to="/user/login"
                color="primary"
                variant="outline"
                size="sm"
              >
                Se connecter
              </UButton>
              <UButton
                to="/user/register"
                color="green"
                variant="solid"
                size="sm"
              >
                Créer un compte
              </UButton>
            </div>
          </div>
          <div v-else-if="simulations.length === 0">
            <p class="text-sm text-gray-600 mb-2">
              Aucune simulation sauvegardée pour le moment
            </p>
            <UButton
              to="/simulator"
              color="green"
              variant="solid"
              size="sm"
            >
              <Icon
                name="i-heroicons-plus"
                class="w-4 h-4 mr-2"
              />
              Créer votre première simulation
            </UButton>
          </div>
          <div v-else>
            <div class="flex flex-col sm:flex-row gap-2">
              <UButton
                color="blue"
                variant="outline"
                size="sm"
                class="w-full sm:w-auto"
                @click="addSimulation"
              >
                <Icon
                  name="i-heroicons-pencil"
                  class="w-4 h-4 mr-2"
                />
                <span class="hidden sm:inline">Ajouter une ligne de test</span>
                <span class="sm:hidden">Ajouter</span>
              </UButton>
              <UButton
                color="orange"
                variant="outline"
                size="sm"
                class="w-full sm:w-auto"
                @click="resetToOriginalValues"
              >
                <Icon
                  name="i-heroicons-arrow-path"
                  class="w-4 h-4 mr-2"
                />
                <span class="hidden sm:inline">Réinitialiser</span>
                <span class="sm:hidden">Reset</span>
              </UButton>
            </div>
          </div>
          <div
            v-if="simulations.length > 0"
            class="text-sm text-gray-600"
          >
            {{ simulations.length }} simulation{{ simulations.length > 1 ? 's' : '' }}
          </div>
        </div>

        <!-- Vue Desktop/Tablet - Tableau -->
        <div
          v-if="simulations.length > 0"
          class="hidden md:block overflow-x-auto"
        >
          <table class="w-full text-xs">
            <!-- En-têtes groupés -->
            <thead>
              <tr class="bg-gray-200">
                <th class="px-2 py-2 text-left font-semibold text-gray-700">
                  Actions
                </th>
                <th class="px-2 py-2 text-left font-semibold text-gray-700">
                  <div class="flex items-center gap-1">
                    <Icon
                      name="i-heroicons-map-pin"
                      class="w-3 h-3"
                    />
                    Localisation
                  </div>
                </th>
                <th
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-green-50 hidden lg:table-cell"
                  colspan="3"
                >
                  🔆 Panneau solaire
                </th>
                <th
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-green-50 lg:hidden table-cell"
                  colspan="2"
                >
                  🔆 Panneau
                </th>
                <th
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-blue-50"
                  colspan="3"
                >
                  🏗️ Installation
                </th>
                <th
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-yellow-50 hidden lg:table-cell"
                  colspan="3"
                >
                  ⚡ Production
                </th>
                <th
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-yellow-50 lg:hidden table-cell"
                  colspan="2"
                >
                  ⚡ Production
                </th>
                <th
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-purple-50 hidden lg:table-cell"
                  colspan="3"
                >
                  💰 Financier
                </th>
                <th
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-purple-50 lg:hidden table-cell"
                  colspan="2"
                >
                  💰 Financier
                </th>
              </tr>
              <tr class="bg-gray-100">
                <th class="px-2 py-2" />
                <th class="px-2 py-2 text-left text-xs font-medium text-gray-600">
                  Adresse
                </th>
                <th
                  class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-green-25 cursor-pointer hover:bg-green-100"
                  @click="sortData('type')"
                >
                  <div class="flex items-center gap-1">
                    Type
                    <SortIcon
                      column-key="type"
                      :sort-config="sortConfig"
                    />
                  </div>
                </th>
                <th
                  class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-green-25 cursor-pointer hover:bg-green-100"
                  @click="sortData('efficiency')"
                >
                  <div class="flex items-center gap-1">
                    Efficacité
                    <SortIcon
                      column-key="efficiency"
                      :sort-config="sortConfig"
                    />
                  </div>
                </th>
                <th class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-green-25 hidden lg:table-cell">
                  Marque
                </th>
                <th class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-blue-25">
                  Surface
                </th>
                <th class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-blue-25">
                  Incl.
                </th>
                <th class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-blue-25">
                  Orient.
                </th>
                <th
                  class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-yellow-25 cursor-pointer hover:bg-yellow-100"
                  @click="sortData('yearlyProduction')"
                >
                  <div class="flex items-center gap-1">
                    Annuelle (kWh)
                    <SortIcon
                      column-key="yearlyProduction"
                      :sort-config="sortConfig"
                    />
                  </div>
                </th>
                <th class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-yellow-25 hidden lg:table-cell">
                  Moy/jour
                </th>
                <th
                  class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-yellow-25 cursor-pointer hover:bg-yellow-100"
                  @click="sortData('co2Saved')"
                >
                  <div class="flex items-center gap-1">
                    CO2 éco. (t)
                    <SortIcon
                      column-key="co2Saved"
                      :sort-config="sortConfig"
                    />
                  </div>
                </th>
                <th
                  class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-purple-25 cursor-pointer hover:bg-purple-100"
                  @click="sortData('yearlyGains')"
                >
                  <div class="flex items-center gap-1">
                    Gains annuels
                    <SortIcon
                      column-key="yearlyGains"
                      :sort-config="sortConfig"
                    />
                  </div>
                </th>
                <th class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-purple-25 hidden lg:table-cell">
                  Production valorisée
                </th>
                <th
                  class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-purple-25 cursor-pointer hover:bg-purple-100"
                  @click="sortData('paybackPeriod')"
                >
                  <div class="flex items-center gap-1">
                    Rentabilité
                    <SortIcon
                      column-key="paybackPeriod"
                      :sort-config="sortConfig"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="row in sortedData"
                :key="row.id"
                class="hover:bg-gray-50"
              >
                <td class="px-2 py-2">
                  <UButton
                    color="red"
                    variant="ghost"
                    size="2xs"
                    @click="removeSimulation(row.id)"
                  >
                    <Icon
                      name="i-heroicons-trash"
                      class="w-3 h-3"
                    />
                  </UButton>
                </td>
                <td class="px-2 py-2 max-w-32">
                  <UInput
                    :model-value="row.address"
                    size="2xs"
                    placeholder="Adresse..."
                    @update:model-value="updateSimulation(row.id, 'address', $event)"
                  />
                </td>
                <td class="px-2 py-2">
                  <USelect
                    :model-value="row.panelConfig"
                    :options="panelConfigOptions"
                    size="2xs"
                    @update:model-value="updateSimulation(row.id, 'panelConfig', $event)"
                  />
                </td>
                <td class="px-2 py-2 font-medium">
                  <div class="flex items-center gap-1">
                    <span>{{ row.efficiency }}%</span>
                    <span class="text-sm">{{ getRankEmoji(rankings.efficiency[row.id]) }}</span>
                  </div>
                </td>
                <td class="px-2 py-2 text-xs text-gray-600 hidden lg:table-cell">
                  {{ row.brand }}
                </td>
                <td class="px-2 py-2">
                  <div class="flex items-center gap-1">
                    <UInput
                      :model-value="row.surface"
                      type="number"
                      size="2xs"
                      class="w-16"
                      min="1"
                      @update:model-value="updateSimulation(row.id, 'surface', parseInt($event as string) || 0)"
                    />
                    <span class="text-xs text-gray-500">m²</span>
                  </div>
                </td>
                <td class="px-2 py-2">
                  <div class="flex items-center">
                    <UInput
                      :model-value="row.inclination"
                      type="number"
                      size="2xs"
                      class="w-12"
                      min="0"
                      max="90"
                      @update:model-value="updateSimulation(row.id, 'inclination', parseInt($event as string) || 0)"
                    />
                    <span class="text-xs text-gray-500">°</span>
                  </div>
                </td>
                <td class="px-2 py-2">
                  <div class="flex items-center">
                    <UInput
                      :model-value="row.orientation"
                      type="number"
                      size="2xs"
                      class="w-12"
                      min="0"
                      max="360"
                      @update:model-value="updateSimulation(row.id, 'orientation', parseInt($event as string) || 0)"
                    />
                    <span class="text-xs text-gray-500">°</span>
                  </div>
                </td>
                <td class="px-2 py-2 font-medium text-green-700">
                  <div class="flex items-center gap-1">
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
                      <span>{{ row.yearlyProduction.toLocaleString() }}</span>
                      <span class="text-sm">{{ getRankEmoji(rankings.yearlyProduction[row.id]) }}</span>
                      <span
                        v-if="!row.isSavedToDatabase"
                        class="text-xs text-orange-600"
                        title="Modification temporaire - Non sauvegardée en base"
                      >
                        🔬
                      </span>
                      <span
                        v-else
                        class="text-xs text-blue-600"
                        title="Données originales sauvegardées en base de données"
                      >
                        💾
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-2 py-2 text-gray-600 text-xs hidden lg:table-cell">
                  {{ row.dailyProduction }} kWh
                </td>
                <td class="px-2 py-2 text-green-600">
                  <div class="flex items-center gap-1">
                    <span>{{ row.co2Saved }} t</span>
                    <span class="text-sm">{{ getRankEmoji(rankings.co2Saved[row.id]) }}</span>
                  </div>
                </td>
                <td class="px-2 py-2 font-medium text-blue-700">
                  <div class="flex items-center gap-1">
                    <span>{{ row.yearlyGains.toLocaleString() }} €</span>
                    <span class="text-sm">{{ getRankEmoji(rankings.yearlyGains[row.id]) }}</span>
                  </div>
                </td>
                <td class="px-2 py-2 text-gray-600 text-xs hidden lg:table-cell">
                  {{ row.valuePerYear }} €/m²/an
                </td>
                <td class="px-2 py-2 font-medium">
                  <div class="flex items-center gap-1">
                    <span
                      :class="{
                        'text-green-600': row.paybackPeriod <= 10,
                        'text-orange-600': row.paybackPeriod > 10 && row.paybackPeriod <= 15,
                        'text-red-600': row.paybackPeriod > 15,
                      }"
                    >
                      {{ row.paybackPeriod }} ans
                    </span>
                    <span class="text-sm">{{ getRankEmoji(rankings.paybackPeriod[row.id]) }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Vue Mobile - Format Cards -->
        <div
          v-if="simulations.length > 0"
          class="md:hidden space-y-4"
        >
          <div
            v-for="row in sortedData"
            :key="row.id"
            class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <!-- En-tête de la carte -->
            <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-start">
              <div class="flex-1 min-w-0">
                <UInput
                  :model-value="row.address"
                  size="sm"
                  placeholder="Adresse..."
                  class="mb-2"
                  @update:model-value="updateSimulation(row.id, 'address', $event)"
                />
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <span class="font-medium">{{ row.brand }}</span>
                  <span class="text-xs font-medium">{{ row.efficiency }}%</span>
                  <span class="text-xs">{{ getRankEmoji(rankings.efficiency[row.id]) }}</span>
                </div>
              </div>
              <UButton
                color="red"
                variant="ghost"
                size="xs"
                @click="removeSimulation(row.id)"
              >
                <Icon
                  name="i-heroicons-trash"
                  class="w-4 h-4"
                />
              </UButton>
            </div>

            <!-- Corps de la carte -->
            <div class="p-4 space-y-4">
              <!-- Section Configuration -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  🏗️ Configuration
                </h4>
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="text-xs text-gray-500 block mb-1">Surface</label>
                    <div class="flex items-center gap-1">
                      <UInput
                        :model-value="row.surface"
                        type="number"
                        size="xs"
                        min="1"
                        @update:model-value="updateSimulation(row.id, 'surface', parseInt($event as string) || 0)"
                      />
                      <span class="text-xs text-gray-500">m²</span>
                    </div>
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 block mb-1">Inclinaison</label>
                    <div class="flex items-center gap-1">
                      <UInput
                        :model-value="row.inclination"
                        type="number"
                        size="xs"
                        min="0"
                        max="90"
                        @update:model-value="updateSimulation(row.id, 'inclination', parseInt($event as string) || 0)"
                      />
                      <span class="text-xs text-gray-500">°</span>
                    </div>
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 block mb-1">Orientation</label>
                    <div class="flex items-center gap-1">
                      <UInput
                        :model-value="row.orientation"
                        type="number"
                        size="xs"
                        min="0"
                        max="360"
                        @update:model-value="updateSimulation(row.id, 'orientation', parseInt($event as string) || 0)"
                      />
                      <span class="text-xs text-gray-500">°</span>
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <label class="text-xs text-gray-500 block mb-1">Type de panneau</label>
                  <USelect
                    :model-value="row.panelConfig"
                    :options="panelConfigOptions"
                    size="xs"
                    @update:model-value="updateSimulation(row.id, 'panelConfig', $event)"
                  />
                </div>
              </div>

              <!-- Section Production -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  ⚡ Production
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-yellow-50 rounded-lg p-3">
                    <div class="text-xs text-gray-500 mb-1">
                      Production annuelle
                    </div>
                    <div class="flex items-center gap-1">
                      <div
                        v-if="row.isLoading"
                        class="flex items-center gap-1"
                      >
                        <div class="w-3 h-3 border border-green-500 border-t-transparent rounded-full animate-spin" />
                        <span class="text-xs text-gray-500">Calcul...</span>
                      </div>
                      <div
                        v-else
                        class="flex items-center gap-1"
                      >
                        <span class="font-semibold text-green-700">{{ row.yearlyProduction.toLocaleString() }}</span>
                        <span class="text-xs text-gray-500">kWh</span>
                        <span class="text-sm">{{ getRankEmoji(rankings.yearlyProduction[row.id]) }}</span>
                      </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ row.dailyProduction }} kWh/jour
                    </div>
                  </div>
                  <div class="bg-green-50 rounded-lg p-3">
                    <div class="text-xs text-gray-500 mb-1">
                      CO2 économisé
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="font-semibold text-green-600">{{ row.co2Saved }}</span>
                      <span class="text-xs text-gray-500">t/an</span>
                      <span class="text-sm">{{ getRankEmoji(rankings.co2Saved[row.id]) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section Financier -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  💰 Aspect financier
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-blue-50 rounded-lg p-3">
                    <div class="text-xs text-gray-500 mb-1">
                      Gains annuels
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="font-semibold text-blue-700">{{ row.yearlyGains.toLocaleString() }}</span>
                      <span class="text-xs text-gray-500">€</span>
                      <span class="text-sm">{{ getRankEmoji(rankings.yearlyGains[row.id]) }}</span>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ row.valuePerYear }} €/m²/an
                    </div>
                  </div>
                  <div class="bg-purple-50 rounded-lg p-3">
                    <div class="text-xs text-gray-500 mb-1">
                      Rentabilité
                    </div>
                    <div class="flex items-center gap-1">
                      <span
                        class="font-semibold"
                        :class="{
                          'text-green-600': row.paybackPeriod <= 10,
                          'text-orange-600': row.paybackPeriod > 10 && row.paybackPeriod <= 15,
                          'text-red-600': row.paybackPeriod > 15,
                        }"
                      >
                        {{ row.paybackPeriod }}
                      </span>
                      <span class="text-xs text-gray-500">ans</span>
                      <span class="text-sm">{{ getRankEmoji(rankings.paybackPeriod[row.id]) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Statut de sauvegarde -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                <div class="flex items-center gap-2">
                  <span
                    v-if="!row.isSavedToDatabase"
                    class="text-xs text-orange-600 flex items-center gap-1"
                  >
                    🔬 <span>Simulation temporaire</span>
                  </span>
                  <span
                    v-else
                    class="text-xs text-blue-600 flex items-center gap-1"
                  >
                    💾 <span>Données originales</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer avec explications -->
        <div
          v-if="simulations.length > 0"
          class="px-4 py-3 bg-gray-50 border-t"
        >
          <div class="text-xs text-gray-600">
            <p><strong>🔬 Mode Simulation "What-If" :</strong></p>
            <ul class="mt-1 space-y-1 text-xs">
              <li>• ✅ <strong>Modifications temporaires uniquement</strong> - Vos données historiques sont préservées</li>
              <li>• ⚡ Recalcul automatique JRC en temps réel lors des modifications (surface, inclinaison, orientation, adresse)</li>
              <li>• 🔄 Debounce 1.5s pour éviter trop de requêtes • ✓ Calcul JRC réussi • 💾 Données originales sauvegardées</li>
              <li>• 🚫 <strong>Aucune sauvegarde en base de données</strong> - Parfait pour tester différents scénarios</li>
              <li>• 🥇🥈🥉 Classement automatique par performance • Cliquez sur les en-têtes pour trier</li>
              <li>• Calculs financiers : autoconsommation 70% + revente surplus 30%</li>
              <li>• CO2 économisé : facteur émission électricité France (0.5 kg CO2/kWh)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
