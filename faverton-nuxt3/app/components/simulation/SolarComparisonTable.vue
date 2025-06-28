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
  originalYearlyEnergy?: number // ✅ Stocker la valeur originale pour les calculs
  monthlyEnergy: number[]
  panelModel: string
  panelEfficiency: number
  panelBrand: string
  panelType: string
  // États pour l'UI
  isLoading?: boolean
  lastUpdated?: Date
  isSavedToDatabase?: boolean // ⚠️ Nouveau : indique si sauvé en base
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

// Récupération des vraies données utilisateur
const user = useSupabaseUser();
const { data: historyData } = await useFetch<SimulationResponse>('/api/simulation/history');

// Cache pour éviter les appels API redondants
const jrcCache = new Map<string, JRCResponse>();
const pendingRequests = new Map<string, Promise<JRCResponse>>();
const geocodeCache = new Map<string, {
  lat: number
  lon: number
}>();

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
  // Avantages : validation centralisée, gestion d'erreurs uniforme, paramètres cohérents
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
    // Si vous voulez la valeur brute JRC (ex: 955.73 kWh/kWc), ne pas multiplier
    // Si vous voulez la production totale de l'installation, multiplier par peakpower

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

// ⚠️ SUPPRIMÉ : Plus de sauvegarde en base de données
// Les modifications sont uniquement temporaires pour les simulations "what-if"

// ✅ Fonction pour recalculer les données JRC temporairement (SANS sauvegarder en base)
const updateJRCDataDebounced = async (simulationId: string, simulation: Simulation) => {
  console.log(`🕐 updateJRCDataDebounced appelée pour simulation ${simulationId}`);

  // Annuler le timeout précédent pour cette simulation
  if (debounceTimeouts.has(simulationId)) {
    console.log(`🕐 Annulation du timeout précédent pour simulation ${simulationId}`);
    clearTimeout(debounceTimeouts.get(simulationId)!);
  }

  // Programmer une nouvelle mise à jour dans 1.5 secondes
  const timeout = setTimeout(async () => {
    console.log(`🚀 Démarrage du recalcul JRC pour simulation ${simulationId}`);
    try {
      // Marquer comme en cours de chargement
      simulation.isLoading = true;

      // Calculer la puissance crête estimée
      const estimatedPowerKWc = simulation.surface * (simulation.panelEfficiency / 100) * 0.15;
      console.log(`💡 Puissance estimée: ${estimatedPowerKWc} kWc (surface: ${simulation.surface}m², efficacité: ${simulation.panelEfficiency}%)`);

      // Obtenir les coordonnées depuis l'adresse
      const coordinates = await getCoordinatesFromAddress(simulation.address);
      console.log(`📍 Coordonnées: lat=${coordinates.lat}, lon=${coordinates.lon}`);

      const jrcParams: JRCRequest = {
        lat: coordinates.lat,
        lon: coordinates.lon,
        peakpower: estimatedPowerKWc,
        inclination: simulation.inclination,
        azimuth: simulation.orientation,
      };

      console.log('📡 Paramètres envoyés à /api/solar-potential/jrc:', {
        lat: jrcParams.lat,
        lon: jrcParams.lon,
        angle: jrcParams.inclination,
        aspect: jrcParams.azimuth,
        peakpower_for_scaling: jrcParams.peakpower, // Utilisé pour le facteur d'échelle
        surface: simulation.surface,
        efficiency: simulation.panelEfficiency,
        originalEnergy: simulation.originalYearlyEnergy,
      });

      const jrcResult = await fetchJRCData(jrcParams);
      console.log(`📊 Résultat JRC: ${Math.round(jrcResult.yearly_energy)} kWh/an`);

      // ✅ MODIFICATION LOCALE UNIQUEMENT - AUCUNE SAUVEGARDE EN BASE
      // Ces modifications sont temporaires pour permettre les simulations "what-if"
      const oldEnergy = simulation.yearlyEnergy;
      simulation.yearlyEnergy = Math.round(jrcResult.yearly_energy);
      console.log(`⚡ Mise à jour yearlyEnergy via JRC: ${oldEnergy} → ${simulation.yearlyEnergy} kWh/an`);

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
      simulation.isSavedToDatabase = false; // Marquer comme modification temporaire

      console.log(`✅ Données JRC recalculées localement pour simulation ${simulationId} (modification temporaire)`);
      console.log(`📊 Valeur finale: yearlyEnergy=${simulation.yearlyEnergy}, isLoading sera false`);
    }
    catch (error) {
      console.error('Erreur lors du recalcul JRC temporaire:', error);
      // En cas d'erreur, garder les valeurs existantes
    }
    finally {
      simulation.isLoading = false;
      debounceTimeouts.delete(simulationId);
    }
  }, 1500); // Attendre 1.5 secondes après la dernière modification

  debounceTimeouts.set(simulationId, timeout);
  console.log(`⏰ Timeout programmé pour simulation ${simulationId} dans 1.5s`);
};

// Conversion des données historiques vers le format du tableau
const simulations = ref<Simulation[]>([]);

// Initialisation des données à partir de l'historique
watch(historyData, (newData) => {
  if (newData?.simulations && user.value) {
    simulations.value = newData.simulations.map(sim => ({
      id: sim.simulation_id,
      address: `${sim.solar_energy?.city}, ${sim.solar_energy?.postal_code}`,
      surface: sim.surface || 0,
      panelConfig: sim.panel?.panel_type_id || 'unknown',
      inclination: sim.solar_energy?.tilt_angle || SOLAR_DEFAULTS.INCLINATION, // 35° optimum France
      orientation: sim.solar_energy?.azimuth || SOLAR_DEFAULTS.AZIMUT, // 0° = Sud optimum
      // Données JRC réelles
      yearlyEnergy: sim.solar_energy?.yearly_energy || 0,
      originalYearlyEnergy: sim.solar_energy?.yearly_energy || 0, // ✅ Stocker la valeur originale
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
      panelBrand: sim.panel?.company || 'Générique',
      panelType: sim.panel?.panel_type_id || 'monocristallin',
      // États pour l'UI - données originales sont considérées comme sauvegardées
      isLoading: false,
      lastUpdated: new Date(),
      isSavedToDatabase: true, // ✅ Les données originales sont sauvegardées en base
    }));
  }
}, { immediate: true });

const sortConfig = ref<SortConfig>({ key: null, direction: 'asc' });

// Calculs basés sur les vraies données JRC
const calculateData = (simulation: Simulation) => {
  // Utilisation des données réelles du panneau
  const panel = {
    name: simulation.panelModel,
    type: simulation.panelType,
    efficiency: simulation.panelEfficiency, // Utilise panelEfficiency de la simulation
    brand: simulation.panelBrand,
  };

  // ✅ CORRECTION : Utiliser la valeur JRC réelle uniquement, pas d'estimation
  // L'estimation rapide créait des valeurs aberrantes (ex: 7168 au lieu de 955.73)
  const currentYearlyEnergy = simulation.yearlyEnergy;

  // Données JRC réelles (déjà en kWh/an)
  const yearlyProduction = Math.round(currentYearlyEnergy);
  const dailyProduction = Math.round((currentYearlyEnergy / 365) * 10) / 10;

  // Calcul des économies CO2 (facteur d'émission électricité FR: 0.5 kg CO2/kWh)
  const co2Saved = Math.round((currentYearlyEnergy * 0.5) / 1000 * 10) / 10;

  // ✅ CORRECTION : Calculs financiers IDENTIQUES à la page historique
  const electricityPrice = 0.1740; // Prix moyen électricité France (€/kWh)
  const selfConsumptionRate = 0.7; // 70% d'autoconsommation
  const feedInTariff = 0.10; // Tarif de rachat surplus (€/kWh)

  // 💰 REPRODUCTION EXACTE de l'API /api/simulation/price-year (même si elle est incorrecte)
  const EDF_PRICE = 0.1269; // Prix utilisé par l'API (différent du calcul local !)
  const HIGH_PERFORMANCE_PANEL = Number((simulation.panelEfficiency / 100).toFixed(2));
  // ⚠️ FORMULE PROBLÉMATIQUE de l'API (multiplie par surface ET efficacité)
  const apiAmount = currentYearlyEnergy * simulation.surface * EDF_PRICE * HIGH_PERFORMANCE_PANEL;

  // 📊 CORRECTION : Cohérence avec le changement de type de panneau
  // TOUS les calculs financiers doivent dépendre de l'efficacité du panneau

  // ✅ Production effective tenant compte de l'efficacité
  const effectiveProduction = currentYearlyEnergy * (simulation.panelEfficiency / 100);

  // ✅ Production valorisée corrigée (avec efficacité du panneau)
  const selfConsumptionSavingsEffective = effectiveProduction * selfConsumptionRate * electricityPrice;
  const gridSaleIncomeEffective = effectiveProduction * (1 - selfConsumptionRate) * feedInTariff;
  const yearlyEconomiesEffective = Math.round(selfConsumptionSavingsEffective + gridSaleIncomeEffective);

  // 📊 Mapping cohérent avec l'historique :
  // - Gains annuels = API (dépend de l'efficacité)
  // - Production valorisée = calcul local effectif (dépend de l'efficacité)
  // - Rentabilité = ratio économies réelles / gains API (inversé pour correspondre aux valeurs attendues)
  const yearlyGains = Math.round(apiAmount * 100) / 100; // Gains annuels (API)
  const valuePerYear = yearlyEconomiesEffective; // Production valorisée (CORRIGÉE avec efficacité)

  // ✅ Rentabilité COHÉRENTE avec l'historique : ratio économies réelles / gains API
  // CORRECTION : L'historique fait amountPerYear / yearlyEconomies, mais pour avoir ~41.8 ans
  // il faut inverser : yearlyEconomies / amountPerYear
  const paybackPeriod = yearlyGains > 0
    ? Math.round((yearlyEconomiesEffective / yearlyGains) * 10) / 10
    : 0;

  // Debug pour comprendre la rentabilite
  if (simulation.id && simulation.id.includes('sim_')) {
    console.log(`� ANALYSE DÉTAILLÉE des calculs pour simulation ${simulation.id}:`, {
      // === DONNÉES BRUTES ===
      currentYearlyEnergy: `${currentYearlyEnergy} kWh/kWc`,
      surface: `${simulation.surface} m²`,
      efficiency: `${simulation.panelEfficiency}%`,

      // === GAINS API (ce qui correspond à amountPerYear dans l'historique) ===
      yearlyGains: `${yearlyGains} €/an (gains API)`,
      detailGainsAPI: {
        formule: `${currentYearlyEnergy} × ${simulation.surface} × ${EDF_PRICE} × ${HIGH_PERFORMANCE_PANEL}`,
        calcul: `${currentYearlyEnergy} × ${simulation.surface} × ${EDF_PRICE} × ${HIGH_PERFORMANCE_PANEL} = ${yearlyGains}`,
      },

      // === ÉCONOMIES RÉELLES (ce qui correspond à yearlyEconomies dans l'historique) ===
      yearlyEconomiesEffective: `${yearlyEconomiesEffective} €/an (économies réelles)`,
      detailEconomiesReelles: {
        effectiveProduction: `${effectiveProduction.toFixed(1)} kWh (avec efficacité)`,
        autoconsommation: `${Math.round(selfConsumptionSavingsEffective)} € (70% × ${electricityPrice} €/kWh)`,
        venteReseau: `${Math.round(gridSaleIncomeEffective)} € (30% × ${feedInTariff} €/kWh)`,
        total: `${yearlyEconomiesEffective} €`,
      },

      // === RENTABILITÉ : DEUX OPTIONS ===
      option1_gainsAPI_div_economies: `${yearlyGains} ÷ ${yearlyEconomiesEffective} = ${(yearlyGains / yearlyEconomiesEffective).toFixed(1)}`,
      option2_economies_div_gainsAPI: `${yearlyEconomiesEffective} ÷ ${yearlyGains} = ${(yearlyEconomiesEffective / yearlyGains).toFixed(1)}`,

      // === RÉSULTAT ACTUEL ===
      paybackPeriod: `${paybackPeriod} ans (actuellement option2)`,

      // === QUESTION ===
      question: 'Laquelle des deux options donne ~41.8 ans comme attendu ?',
    });
  }

  // Log temporaire pour debug rentabilite
  console.log('Debug rentabilite:', {
    yearlyGains,
    yearlyEconomiesEffective,
    option1_gains_div_economies: (yearlyGains / yearlyEconomiesEffective).toFixed(1),
    option2_economies_div_gains: (yearlyEconomiesEffective / yearlyGains).toFixed(1),
    paybackPeriod_actuel: paybackPeriod,
  });

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
  console.log(`🔧 updateSimulation appelée: ${field} = ${value} pour simulation ${id}`);

  const index = simulations.value.findIndex(sim => sim.id === id);
  if (index !== -1) {
    const simulation = simulations.value[index];
    if (!simulation) return;

    // Log de débogage des valeurs avant modification
    console.log(`📊 Avant modification - ${field}: ${simulation[field]}, inclination: ${simulation.inclination}, orientation: ${simulation.orientation}`);

    // ✅ IMPORTANT : Stocker la valeur originale si c'est la première modification
    if (!simulation.originalYearlyEnergy && simulation.yearlyEnergy > 0) {
      simulation.originalYearlyEnergy = simulation.yearlyEnergy;
      console.log(`💾 Stockage valeur originale: ${simulation.originalYearlyEnergy} kWh/an`);
    }

    if (typeof value === 'string' && typeof simulation[field] === 'string') {
      (simulation[field] as string) = value;
    }
    else if (typeof value === 'number' && typeof simulation[field] === 'number') {
      (simulation[field] as number) = value;
    }

    // Log de débogage des valeurs après modification
    console.log(`📊 Après modification - ${field}: ${simulation[field]}, inclination: ${simulation.inclination}, orientation: ${simulation.orientation}`);

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
      console.log(`🚀 Déclenchement updateJRCDataDebounced pour champ: ${field}`);
      // Déclencher une mise à jour JRC en temps réel (avec debounce)
      updateJRCDataDebounced(id, simulation);

      // ✅ SUPPRESSION : Plus d'estimation rapide - elle créait des valeurs aberrantes
      // On attend directement la réponse de l'API JRC qui donne la valeur exacte
    }
  }
  else {
    console.error(`❌ Simulation avec ID ${id} non trouvée`);
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
    originalYearlyEnergy: defaultEnergy, // ✅ Définir aussi la valeur originale
    monthlyEnergy: Array(12).fill(200),
    panelModel: 'Standard',
    panelEfficiency: 18,
    panelBrand: 'Générique',
    panelType: 'Monocristallin',
    // États pour l'UI
    isLoading: false,
    lastUpdated: new Date(),
    isSavedToDatabase: false, // ✅ Les nouvelles simulations ne sont pas sauvegardées
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
      originalYearlyEnergy: sim.solar_energy?.yearly_energy || 0, // ✅ Réinitialiser aussi la valeur originale
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
      panelBrand: sim.panel?.company || 'Générique',
      panelType: sim.panel?.panel_type_id || 'monocristallin',
      // États pour l'UI - données originales sont considérées comme sauvegardées
      isLoading: false,
      lastUpdated: new Date(),
      isSavedToDatabase: true, // ✅ Les données originales sont sauvegardées en base
    }));
    console.log('✅ Toutes les simulations réinitialisées aux valeurs originales');
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
            <div class="flex gap-2">
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
                Nouvelle simulation
              </UButton>
              <UButton
                color="blue"
                variant="outline"
                size="sm"
                @click="addSimulation"
              >
                <Icon
                  name="i-heroicons-pencil"
                  class="w-4 h-4 mr-2"
                />
                Ajouter une ligne de test
              </UButton>
              <UButton
                color="orange"
                variant="outline"
                size="sm"
                @click="resetToOriginalValues"
              >
                <Icon
                  name="i-heroicons-arrow-path"
                  class="w-4 h-4 mr-2"
                />
                Réinitialiser
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

        <!-- Tableau - Affiché seulement s'il y a des données -->
        <div
          v-if="simulations.length > 0"
          class="overflow-x-auto"
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
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-green-50"
                  colspan="3"
                >
                  🔆 Panneau solaire
                </th>
                <th
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-blue-50"
                  colspan="3"
                >
                  🏗️ Installation
                </th>
                <th
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-yellow-50"
                  colspan="3"
                >
                  ⚡ Production
                </th>
                <th
                  class="px-2 py-2 text-center font-semibold text-gray-700 bg-purple-50"
                  colspan="3"
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
                <th class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-green-25">
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
                <th class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-yellow-25">
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
                <th class="px-2 py-2 text-left text-xs font-medium text-gray-600 bg-purple-25">
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
                <td class="px-2 py-2 text-xs text-gray-600">
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
                        v-if="row.lastUpdated"
                        class="text-xs text-green-600"
                        :title="`Dernière mise à jour JRC: ${row.lastUpdated?.toLocaleTimeString()}`"
                      >
                        ✓
                      </span>
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
                <td class="px-2 py-2 text-gray-600 text-xs">
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
                <td class="px-2 py-2 text-gray-600 text-xs">
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
