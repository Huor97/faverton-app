<script setup lang="ts">
import { useAddSimulation } from '~/composables/useSimulation';
import { useMapStore } from '~/stores/map';
import type { Properties } from '~~/shared/types/address/new-base-address-national';
import { SOLAR_DEFAULTS, SOLAR_LIMITS, ORIENTATION_SUGGESTIONS } from '~~/shared/constants/solar-parameters';

const mapStore = useMapStore();

const props = defineProps<{
  addressProperty: Properties | null
  responseSolarEnergyId: SolarEnergyResponse | null
  activeTab: number
}>();

const inclination = defineModel<number>('inclination', { default: SOLAR_DEFAULTS.INCLINATION });
const azimut = defineModel<number>('azimut', { default: SOLAR_DEFAULTS.AZIMUT });
const emit = defineEmits(['update:simulation', 'update:activeTab']);

const goToResults = () => {
  emit('update:activeTab', 1);
};

const surface = ref<number>(SOLAR_DEFAULTS.SURFACE);
const panelId = ref<string | undefined>(undefined);

const handleStart = async () => {
  if (props.responseSolarEnergyId && panelId.value) {
    // Note: L'API actuelle ne prend pas encore en compte l'inclinaison et l'azimut
    // Ces valeurs sont stockées pour un usage futur
    const responsePropertySimulation = await useAddSimulation(
      props.responseSolarEnergyId.solarEnergyId,
      panelId.value,
    );
    if (responsePropertySimulation) {
      const simulationData = {
        ...responsePropertySimulation,
        surface: surface.value,
        inclination: inclination.value,
        azimut: azimut.value,
      };
      emit('update:simulation', simulationData);
      goToResults();
    }
  }
};

const isFormValid = computed(() =>
  !!props.addressProperty
  && !!surface.value
  && !!panelId.value
  && inclination.value >= SOLAR_LIMITS.INCLINATION.MIN
  && inclination.value <= SOLAR_LIMITS.INCLINATION.MAX
  && azimut.value >= SOLAR_LIMITS.AZIMUT.MIN
  && azimut.value <= SOLAR_LIMITS.AZIMUT.MAX,
);
// Calcul de l'inclinaison optimale basée sur la latitude
const optimalInclination = computed(() => {
  // Utilise une latitude moyenne pour la France métropolitaine (46°)
  // TODO: Intégrer les vraies coordonnées depuis l'adresse sélectionnée
  const averageLatitudeFrance = 46;
  return Math.round(averageLatitudeFrance);
});

const info = [
  {
    label: 'Recherchez votre adresse pour évaluer l\'ensoleillement spécifique à votre localisation. Le potentiel solaire varie selon la latitude et les conditions météorologiques locales.',
    infoBol: '1',
  },
  {
    label: 'Sélectionnez un modèle de panneau solaire. Chaque type (monocristallin, polycristallin) possède un rendement différent qui influence directement votre production d\'énergie.',
    infoBol: '2',
  },
  {
    label: 'Indiquez la surface disponible pour vos panneaux, en dessinant sur la carte ou en saisissant la valeur en m². La surface détermine votre capacité de production totale.',
    infoBol: '3',
  },
  {
    label: 'Configurez l\'orientation et l\'inclinaison des panneaux. Une orientation sud avec une inclinaison optimisée maximise la production d\'énergie solaire.',
    infoBol: '4',
  },
];

watch(() => mapStore.drawnArea, (newArea) => {
  if (newArea > 0) {
    surface.value = newArea;
  }
  else if (newArea === 0) {
    surface.value = SOLAR_DEFAULTS.SURFACE;
  }
});

const activateDrawing = () => {
  mapStore.startDrawing();
};
</script>

<template>
  <div
    class="z-[999] m-0 px-6 flex flex-col gap-8"
  >
    <div class="flex flex-col gap-1">
      <FavertonCardInfo
        :label="info[0]?.label"
        :info-bol="info[0]?.infoBol"
      />
      <FavertonInputSearch />
    </div>
    <div class="flex flex-col gap-1">
      <FavertonCardInfo
        :label="info[1]?.label"
        :info-bol="info[1]?.infoBol"
      />
      <FavertonSelectMenu v-model="panelId" />
    </div>
    <div class="flex flex-col gap-1">
      <FavertonCardInfo
        :label="info[2]?.label"
        :info-bol="info[2]?.infoBol"
      />
      <div class="flex gap-2">
        <UButton
          icon="i-heroicons-paint-brush-20-solid"
          label="Dessiner votre surface"
          @click="activateDrawing"
        />
        <UDivider
          label="OU"
          orientation="vertical"
        />
        <FavertonInputSurface v-model="surface" />
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <FavertonCardInfo
        :label="info[3]?.label"
        :info-bol="info[3]?.infoBol"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Inclinaison -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">
            Inclinaison (degrés)
          </label>
          <div class="flex items-center gap-2">
            <UInput
              v-model.number="inclination"
              type="number"
              min="0"
              max="90"
              class="flex-1"
              placeholder="35"
              size="xl"
            />
            <UButton
              variant="soft"
              size="xl"
              @click="inclination = optimalInclination"
            >
              Optimal ({{ optimalInclination }}°)
            </UButton>
          </div>

          <p
            class="text-xs text-gray-500"
          >
            0° = horizontal, 90° = vertical
            • Optimal pour la France : {{ optimalInclination }}°
          </p>
        </div>

        <!-- Orientation -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">
            Orientation (azimut)
          </label>
          <div class="flex items-center gap-2">
            <USelect
              v-model="azimut"
              :options="ORIENTATION_SUGGESTIONS"
              option-attribute="label"
              value-attribute="value"
              size="xl"
              class="flex-1"
            />
            <UInput
              v-model.number="azimut"
              size="xl"
              type="number"
              min="-180"
              max="180"
              class="w-20"
              placeholder="0"
            />
          </div>
          <p class="text-xs text-gray-500">
            0° = Sud, -90° = Est, 90° = Ouest
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <UButton
        label="Lancer la simulation"
        :disabled="!isFormValid"
        size="xl"
        @click="handleStart"
      />
    </div>
  </div>
</template>
