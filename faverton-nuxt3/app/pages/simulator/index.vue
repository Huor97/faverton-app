<script setup lang="ts">
import { useAddressStore } from '~/stores/address';
import { useFetchJrc } from '~/composables/useFetchJrc';
import { useSaveJRCDataToFaverton } from '~/composables/useSaveJRCData';
import { useMapPreferences } from '~/composables/useMapPreferences';
import SolarComparisonTable from '~/components/simulation/SolarComparisonTable.vue';
import type { Properties } from '~~/shared/types/address/new-base-address-national';
import { SOLAR_DEFAULTS } from '~~/shared/constants/solar-parameters';

const responseSolarEnergyId = ref<SolarEnergyResponse | null>(null);
const errorPost = ref<Error | null>(null);
const activeTab = ref(0);
const simulationResult = ref<propertySimulationResult | null>(null);
const user = useSupabaseUser();

// Utilisation du composable pour les préférences de carte
const {
  isMapVisible,
  mapSize,
  mapSizeClasses,
  toggleMapVisibility,

} = useMapPreferences();

// Animation de révélation progressive lors du changement de taille
const isResizing = ref(false);
const resizeTimeout = ref<NodeJS.Timeout | null>(null);

// Watcher pour déclencher l'animation de redimensionnement
watch(mapSize, () => {
  isResizing.value = true;
  if (resizeTimeout.value) {
    clearTimeout(resizeTimeout.value);
  }
  resizeTimeout.value = setTimeout(() => {
    isResizing.value = false;
  }, 300);
});

// Nettoyage du timeout
onUnmounted(() => {
  if (resizeTimeout.value) {
    clearTimeout(resizeTimeout.value);
  }
});

const addressStore = useAddressStore();

const addressProperty = computed<Properties | null>(() => addressStore.savedAddress?.featureCollection.features[0]?.properties || null);
const postalCode = computed(() => addressProperty.value?.postcode || null);
const city = computed(() => addressProperty.value?.city || null);
const latitude = computed<number | null>(() => addressStore.savedAddress?.featureCollection.features?.[0]?.geometry?.coordinates[1] || null);
const longitude = computed<number | null>(() => addressStore.savedAddress?.featureCollection.features?.[0]?.geometry?.coordinates[0] || null);

// Paramètres d'installation solaire - valeurs par défaut
const inclination = ref(SOLAR_DEFAULTS.INCLINATION);
const azimut = ref(SOLAR_DEFAULTS.AZIMUT);

const { data } = useFetchJrc(latitude, longitude, inclination, azimut);
const jrcResponse = computed<PVGISData | null>(() => data.value || null);

const getSolarEnergy = async () => {
  if (jrcResponse.value && postalCode.value && city.value) {
    const response = await useSaveJRCDataToFaverton(jrcResponse, postalCode, city);
    if (response?.error) errorPost.value = response.error as Error;
    else responseSolarEnergyId.value = response?.solarEnergyId?.value ? response?.solarEnergyId?.value : null;
  }
};

watch(jrcResponse, (newJrc) => {
  if (newJrc) {
    getSolarEnergy();
  }
});

const authPromptInfo = {
  icon: 'i-heroicons-table-cells-20-solid',
  title: 'Tableau de comparaison des simulations',
  description: 'Connectez-vous pour accéder à votre historique de simulations, comparer les différentes configurations et optimiser votre projet solaire.',
};
</script>

<template>
  <div>
    <div class="z-[9000] fixed top-2 left-5">
      <UBreadcrumb
        :links="[{ label: 'Accueil', to: '/introduction' }, { label: 'Simulateur' }]"
      >
        <template #default="{ link, isActive }">
          <UBadge
            :color="isActive ? 'primary' : 'gray'"
            class="rounded-full truncate"
          >
            {{ link.label }}
          </UBadge>
        </template>
      </UBreadcrumb>
    </div>
    <div class="flex flex-col-reverse md:flex-row">
      <FavertonCard
        :class="[
          'transition-all duration-500 ease-in-out',
          isMapVisible ? 'md:w-1/2' : 'md:w-full',
        ]"
      >
        <h1 class="text-xl text-center p-6">
          Étapes de l'estimation
        </h1>
        <FavertonTabs
          v-model="activeTab"
          :active-result="!simulationResult"
        />
        <SimulationParameters
          v-if="activeTab === 0"
          v-model:inclination="inclination"
          v-model:azimut="azimut"
          :active-tab="activeTab"
          :address-property
          :response-solar-energy-id
          @update:simulation="simulationResult = $event"
          @update:active-tab="activeTab = $event"
        />
        <SimulationResult
          v-else-if="activeTab === 1"
          :property-simulation="simulationResult"
        />
        <SimulationHistoryAccess v-else-if="activeTab === 2" />
      </FavertonCard>

      <!-- Carte avec animations -->
      <Transition
        name="map-slide"
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 transform translate-x-full scale-95"
        enter-to-class="opacity-100 transform translate-x-0 scale-100"
        leave-active-class="transition-all duration-400 ease-in"
        leave-from-class="opacity-100 transform translate-x-0 scale-100"
        leave-to-class="opacity-0 transform translate-x-full scale-95"
      >
        <div
          v-if="isMapVisible"
          :class="[
            'transition-all duration-300 ease-in-out',
            mapSizeClasses,
            'relative overflow-hidden',
            isResizing ? 'ring-2 ring-blue-400 ring-opacity-50' : '',
          ]"
          class="md:w-1/2 rounded-lg shadow-lg my-10 mx-5 p-5 bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200"
        >
          <!-- Indicateur de taille en haut à droite avec animation -->
          <Transition
            name="badge-bounce"
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-50 rotate-180"
            enter-to-class="opacity-100 scale-100 rotate-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 rotate-0"
            leave-to-class="opacity-0 scale-50 rotate-180"
          >
            <div
              v-if="isMapVisible"
              class="absolute top-2 right-2 z-10"
            >
              <UBadge
                :color="mapSize === 'small' ? 'green' : mapSize === 'medium' ? 'blue' : 'purple'"
                variant="soft"
                :class="[
                  'text-xs transition-all duration-300',
                  isResizing ? 'scale-110 shadow-lg' : 'scale-100',
                ]"
              >
                {{ mapSize === 'small' ? '30%' : mapSize === 'medium' ? '50%' : '70%' }}
              </UBadge>
            </div>
          </Transition>

          <!-- Animation de chargement de la carte -->
          <div class="relative h-full w-full">
            <Transition
              name="map-content"
              enter-active-class="transition-all duration-700 ease-out delay-200"
              enter-from-class="opacity-0 scale-105 blur-sm"
              enter-to-class="opacity-100 scale-100 blur-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 scale-100 blur-0"
              leave-to-class="opacity-0 scale-95 blur-sm"
            >
              <ClientOnly v-if="isMapVisible">
                <div
                  :class="[
                    'h-full w-full rounded-md overflow-hidden shadow-inner transition-all duration-300',
                    isResizing ? 'scale-[0.98] brightness-110' : 'scale-100 brightness-100',
                  ]"
                >
                  <FavertonMap class="h-full w-full" />
                </div>

                <!-- Overlay avec titre et taille - Animation d'apparition -->
                <Transition
                  name="overlay-slide"
                  enter-active-class="transition-all duration-500 ease-out delay-300"
                  enter-from-class="opacity-0 transform translate-y-4"
                  enter-to-class="opacity-100 transform translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 transform translate-y-0"
                  leave-to-class="opacity-0 transform translate-y-4"
                >
                  <div
                    v-if="isMapVisible"
                    class="absolute bottom-2 left-2 z-10"
                  >
                    <div
                      :class="[
                        'bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md border transition-all duration-300',
                        isResizing ? 'bg-white/95 shadow-lg scale-105' : 'bg-white/90 shadow-md scale-100',
                      ]"
                    >
                      <div class="flex items-center gap-2">
                        <Icon
                          name="i-heroicons-map"
                          :class="[
                            'w-4 h-4 text-blue-600 transition-all duration-300',
                            isResizing ? 'animate-pulse text-blue-700' : '',
                          ]"
                        />
                        <span class="text-sm font-medium text-gray-700">Faverton Map</span>
                        <div
                          v-if="isResizing"
                          class="w-2 h-2 bg-blue-500 rounded-full animate-ping"
                        />
                      </div>
                    </div>
                  </div>
                </Transition>
              </ClientOnly>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>

    <FavertonCard>
      <template v-if="!user">
        <UserAuthPrompt
          :icon="authPromptInfo.icon"
          :title="authPromptInfo.title"
          :description="authPromptInfo.description"
        />
      </template>
      <template v-else>
        <SolarComparisonTable />
      </template>
    </FavertonCard>

    <!-- Bouton flottant pour contrôler la carte -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div
        v-show="true"
        class="fixed bottom-6 right-6 z-[8999]"
      >
        <UButton
          color="primary"
          variant="solid"
          size="lg"
          class="rounded-full shadow-xl px-6"
          data-testid="floating-map-button"
          @click="toggleMapVisibility"
        >
          <Icon
            :name="isMapVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
            class="w-5 h-5 mr-2"
          />
          {{ isMapVisible ? 'Cacher la carte' : 'Afficher la carte' }}
        </UButton>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Animations personnalisées pour la carte */
.map-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.map-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.map-slide-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.map-slide-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

/* Animation pour le contenu de la carte */
.map-content-enter-active {
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.map-content-leave-active {
  transition: all 0.2s ease-in;
}

.map-content-enter-from {
  opacity: 0;
  transform: scale(1.05);
  filter: blur(4px);
}

.map-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
  filter: blur(4px);
}

/* Animation pour le badge de taille */
.badge-bounce-enter-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.badge-bounce-leave-active {
  transition: all 0.2s ease-in;
}

.badge-bounce-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(180deg);
}

.badge-bounce-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(180deg);
}

/* Animation pour l'overlay */
.overlay-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.3s;
}

.overlay-slide-leave-active {
  transition: all 0.2s ease-in;
}

.overlay-slide-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.overlay-slide-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

/* Effets de hover pour les contrôles */
.map-controls:hover {
  transform: scale(1.02);
}

/* Animation de pulsation pour l'état de redimensionnement */
@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

.resize-indicator {
  animation: pulse-ring 1s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}

/* Keyframes pour des micro-interactions */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.map-loading {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
