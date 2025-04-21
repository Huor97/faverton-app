<script setup lang="ts">
import type { PVGISData } from "~~/shared/types/jrc-potential-solar";
import { useAddressStore } from '~/stores/address';
import type { FeatureCollection, Properties } from '~~/shared/types/address/new-base-address-national';

const lat = ref<number>();
const lon = ref<number>();
const postalCode = ref<string>();
const city = ref<string>();
const favertonSolarData = ref(null);
const fetchError = ref(null);
const isLoading = ref(false);
const resultSolareEnergy = ref();
const jrcResponse = ref<PVGISData | null>(null);

const addressStore = useAddressStore();
const featureCollection = computed<FeatureCollection | null>(() => addressStore.savedAddress?.featureCollection || null);

const addressProperty = computed<Properties | null>(() => {
  return addressStore.savedAddress?.featureCollection.features[0]?.properties || null;
});

watch(featureCollection, (newVal) => {
  if (newVal && newVal.features && newVal.features.length > 0) {
    lat.value = newVal.features[0]?.geometry.coordinates[1];
    lon.value = newVal.features[0]?.geometry.coordinates[0];
    postalCode.value = newVal.features[0]?.properties.postcode;
    city.value = newVal.features[0]?.properties.city;
  }
  else {
    lat.value = undefined;
    lon.value = undefined;
    postalCode.value = undefined;
    city.value = undefined;
  }
});

const fetchSolarData = async () => {
  favertonSolarData.value = null;
  fetchError.value = null;
  isLoading.value = true;

  try {
    if (postalCode.value && city.value) {
      if (lat.value && lon.value) {
        jrcResponse.value = await $fetch<PVGISData>(`/api/solar-potential/jrc`, {
          query: {
            lat: lat.value,
            lon: lon.value,
          },
        });
      }
    }
  }
  catch (error) {
    fetchError.value = error;
  }
  finally {
    isLoading.value = false;
  }
};

// Déclencher la recherche quand les valeurs changent
watch([postalCode, city, lat, lon], () => {
  fetchSolarData();
});

onMounted(() => {
  if ((postalCode.value && city.value) || (lat.value && lon.value)) {
    fetchSolarData();
  }
});

watch(favertonSolarData, (newfavertonSolarData) => {
  if (newfavertonSolarData) {
    resultSolareEnergy.value = newfavertonSolarData;
  }
});

const solarEnergy = computed(() => {
  if (!resultSolareEnergy.value) return [];
  return resultSolareEnergy.value[0];
});
</script>

<template>
  <div>
    <CalcNavigationDrawers
      :address-property
      :solar-energy
    />
    {{ jrcResponse }}

    <ClientOnly>
      <FavertonMap />
    </ClientOnly>
  </div>
</template>
