<script setup lang="ts">
import { useAddSimulation } from '~/composables/useSimulation';
import { useMapStore } from '~/stores/map';
import type { Properties } from '~~/shared/types/address/new-base-address-national';

const mapStore = useMapStore();

const props = defineProps<{
  addressProperty: Properties | null
  responseSolarEnergyId: SolarEnergyResponse | null
}>();

const modelValue = defineModel<number>();
const emit = defineEmits([`update:simulation`]);
const goToResults = () => {
  modelValue.value = 1;
};
const surface = ref<number>(1);
const panelId = ref<string | null>(null);

const handleStart = async () => {
  if (props.responseSolarEnergyId && panelId.value) {
    const responsePropertySimulation = await useAddSimulation(props.responseSolarEnergyId.solarEnergyId, panelId.value);
    if (responsePropertySimulation) {
      const simulationData = {
        ...responsePropertySimulation,
        surface: surface.value,
      };
      emit(`update:simulation`, simulationData);
      goToResults();
    }
  }
};

const isFormValid = computed(() =>
  !!props.addressProperty
  && !!surface.value
  && !!panelId.value,
);
const info = [
  {
    label: `Recherchez votre adresse pour évaluer l'ensoleillement spécifique à votre localisation. Le potentiel solaire varie selon la latitude et les conditions météorologiques locales.`,
    infoBol: `1`,
  },
  {
    label: `Sélectionnez un modèle de panneau solaire. Chaque type (monocristallin, polycristallin) possède un rendement différent qui influence directement votre production d'énergie.`,
    infoBol: `2`,
  },
  {
    label: `Indiquez la surface disponible pour vos panneaux, en dessinant sur la carte ou en saisissant la valeur en m². La surface détermine votre capacité de production totale.`,
    infoBol: `3`,
  },
];

watch(() => mapStore.drawnArea, (newArea) => {
  if (newArea > 0) {
    surface.value = newArea;
  }
  else if (newArea === 0) {
    surface.value = 1;
  }
});

const activateDrawing = () => {
  mapStore.startDrawing();
};
</script>

<template>
  <div
    class="z-[999] m-0 px-6 flex flex-col gap-6"
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
          label="Desiner votre surface"
          @click="activateDrawing"
        />
        <UDivider
          label="OU"
          orientation="vertical"
        />
        <FavertonInputSurface v-model="surface" />
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
