<script setup lang="ts">
const { data: simulation } = await useFetch(`/api/simulation/history`);
// étape 2
// TODO: supprime une history "history vient false"
// étape 3
// TODO: ouvrire une history: la même sur la page simulate

// État pour suivre la simulation sélectionnée
const selectedSimulation = ref(null);

// Données statiques de démonstration (à remplacer par les données réelles plus tard)
const mockSimulations = [
  {
    id: `1`,
    date: `12/03/2025`,
    location: `Nantes, France`,
    panel_type: `Premium Solar 300W`,
    annual_production: `3500 kWh`,
    surface: `20m²`,
  },
  {
    id: `2`,
    date: `10/03/2025`,
    location: `Lyon, France`,
    panel_type: `Standard Solar 250W`,
    annual_production: `2800 kWh`,
    surface: `18m²`,
  },
  {
    id: `3`,
    date: `05/03/2025`,
    location: `Paris, France`,
    panel_type: `Ultra Solar 350W`,
    annual_production: `4200 kWh`,
    surface: `25m²`,
  },
];

// Données détaillées pour la simulation sélectionnée
const mockDetailData = {
  id: `1`,
  date: `12/03/2025`,
  location: `Nantes, France`,
  address: `12 Rue de la Liberté, 44000 Nantes`,
  coordinates: `47.218371, -1.553621`,
  panel: {
    type: `Premium Solar 300W`,
    efficiency: `22%`,
    brand: `SolarTech`,
    warranty: `25 ans`,
    price_per_unit: `450€`,
    dimensions: `1.7m x 1.0m`,
  },
  installation: {
    surface: `20m²`,
    number_of_panels: `10`,
    orientation: `Sud`,
    inclination: `30°`,
    estimated_cost: `12,500€`,
  },
  production: {
    annual_production: `3500 kWh`,
    daily_average: `9.6 kWh`,
    co2_saved: `1.75 tonnes/an`,
    self_consumption_rate: `70%`,
    grid_injection_rate: `30%`,
  },
  financial: {
    total_investment: `12,500€`,
    yearly_savings: `980€`,
    payback_period: `12.8 ans`,
    roi_10_years: `78%`,
    roi_25_years: `196%`,
  },
};

function selectSimulation(sim) {
  selectedSimulation.value = sim.id === selectedSimulation.value?.id ? null : sim;
}

function getDetailedData(id) {
  // Plus tard, cette fonction récupérerait les données détaillées depuis l'API
  return mockDetailData;
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">
      Historique des simulations
    </h1>

    <!-- Liste des simulations -->
    <div class="grid gap-4 mb-8">
      <div
        v-for="sim in mockSimulations"
        :key="sim.id"
        class="bg-white p-4 rounded-lg shadow cursor-pointer transition-all hover:shadow-md"
        :class="{ 'border-2 border-green-500': selectedSimulation?.id === sim.id }"
        @click="selectSimulation(sim)"
      >
        <div class="flex justify-between items-center">
          <div>
            <div class="text-lg font-semibold mb-1">
              {{ sim.location }}
            </div>
            <div class="text-sm text-gray-600">
              {{ sim.date }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm">
              {{ sim.panel_type }}
            </div>
            <div class="text-sm font-medium text-green-600">
              {{ sim.annual_production }}
            </div>
            <div class="text-sm text-gray-500">
              {{ sim.surface }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue détaillée de la simulation sélectionnée -->
    <div
      v-if="selectedSimulation"
      class="bg-white p-6 rounded-lg shadow-lg"
    >
      <div class="flex justify-between items-start mb-6">
        <div>
          <h2 class="text-xl font-bold">
            Simulation #{{ selectedSimulation.id }}
          </h2>
          <p class="text-gray-600">
            {{ getDetailedData(selectedSimulation.id).date }}
          </p>
          <p class="mt-2">
            {{ getDetailedData(selectedSimulation.id).address }}
          </p>
        </div>
        <button
          class="p-2 text-gray-500 hover:text-gray-700"
          @click="selectedSimulation = null"
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
            <p>{{ getDetailedData(selectedSimulation.id).panel.type }}</p>
            <p class="text-gray-600">
              Efficacité:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).panel.efficiency }}</p>
            <p class="text-gray-600">
              Marque:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).panel.brand }}</p>
            <p class="text-gray-600">
              Garantie:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).panel.warranty }}</p>
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
            <p>{{ getDetailedData(selectedSimulation.id).installation.surface }}</p>
            <p class="text-gray-600">
              Nombre de panneaux:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).installation.number_of_panels }}</p>
            <p class="text-gray-600">
              Orientation:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).installation.orientation }}</p>
            <p class="text-gray-600">
              Inclinaison:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).installation.inclination }}</p>
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
            <p>{{ getDetailedData(selectedSimulation.id).production.annual_production }}</p>
            <p class="text-gray-600">
              Moyenne journalière:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).production.daily_average }}</p>
            <p class="text-gray-600">
              CO2 économisé:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).production.co2_saved }}</p>
          </div>
        </div>

        <!-- Financier -->
        <div class="border rounded-lg p-4">
          <h3 class="font-semibold mb-4 pb-2 border-b border-gray-200">
            Financier
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <p class="text-gray-600">
              Investissement:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).financial.total_investment }}</p>
            <p class="text-gray-600">
              Économies annuelles:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).financial.yearly_savings }}</p>
            <p class="text-gray-600">
              Retour sur investissement:
            </p>
            <p>{{ getDetailedData(selectedSimulation.id).financial.payback_period }}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Refaire cette simulation
        </button>
        <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Supprimer de l'historique
        </button>
      </div>
    </div>

    <!-- Message lorsqu'aucune simulation n'est sélectionnée -->
    <div
      v-if="!selectedSimulation && mockSimulations.length > 0"
      class="text-center py-10 text-gray-500"
    >
      Cliquez sur une simulation pour voir les détails
    </div>

    <!-- Message lorsqu'il n'y a pas de simulations -->
    <div
      v-if="mockSimulations.length === 0"
      class="text-center py-10 text-gray-500"
    >
      Aucune simulation dans l'historique
    </div>
  </div>
</template>
