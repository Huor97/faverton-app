<script setup lang="ts">
import { useAddressStore } from '~/stores/address';
import { useFetchJrc } from '~/composables/useFetchJrc';
import { useSaveJRCDataToFaverton } from '~/composables/useSaveJRCData';
import type { Properties } from '~~/shared/types/address/new-base-address-national';

const responseSolarEnergyId = ref<SolarEnergyResponse | null>(null);
const errorPost = ref<Error | null>(null);
const activeTab = ref(0);
const simulationResult = ref<propertySimulationResult | null>(null);

const addressStore = useAddressStore();

const addressProperty = computed<Properties | null>(() => addressStore.savedAddress?.featureCollection.features[0]?.properties || null);
const postalCode = computed(() => addressProperty.value?.postcode || null);
const city = computed(() => addressProperty.value?.city || null);
const latitude = computed<number | null>(() => addressStore.savedAddress?.featureCollection.features?.[0]?.geometry?.coordinates[1] || null);
const longitude = computed<number | null>(() => addressStore.savedAddress?.featureCollection.features?.[0]?.geometry?.coordinates[0] || null);

const { data } = useFetchJrc(latitude, longitude);
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
</script>

<template>
  <div>
    <FavertonCard>
      <h1 class="text-xl text-center p-5 text-white">
        Étapes de l'estimation
      </h1>
      <FavertonTabs
        v-model="activeTab"
        :active-result="!simulationResult"
      />
      <SimulationParameters
        v-if="activeTab === 0"
        v-model="activeTab"
        :address-property
        :response-solar-energy-id
        @update:simulation="simulationResult = $event"
      />
      <SimulationResult
        v-else-if="activeTab === 1"
        :property-simulation="simulationResult"
      />
      <SimulationHistoryAccess v-else-if="activeTab === 2" />
    </FavertonCard>
    <ClientOnly>
      <FavertonMap />
    </ClientOnly>
  </div>
</template>
