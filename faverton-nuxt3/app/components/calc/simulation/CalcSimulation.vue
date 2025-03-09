<script setup lang="ts">
import type { PVGISData } from "~/types/potential-solar";
import { useAddressStore } from '~/stores/address';
import type { FeatureCollection, Properties } from '~/types/address/new-base-address-national';

const lat = ref<number>();
const lon = ref<number>();
const postalCode = ref<string>();
const city = ref<string>();
const favertonSolarData = ref(null);
const fetchError = ref(null);
const isLoading = ref(false);
const isSaving = ref(false);
const resultSolareEnergy = ref();

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

// TODO: after do create the composable
const saveJRCDataToFaverton = async (jrcData: PVGISData) => {
  if (!postalCode.value || !city.value || !lat.value || !lon.value) {
    console.error(`Missing location information`);
    return null;
  }

  isSaving.value = true;

  try {
    const dataToSave = {
      postalCode: postalCode.value,
      city: city.value,
      month1Energy: jrcData.outputs.monthly.fixed[0]?.E_m,
      month2Energy: jrcData.outputs.monthly.fixed[1]?.E_m,
      month3Energy: jrcData.outputs.monthly.fixed[2]?.E_m,
      month4Energy: jrcData.outputs.monthly.fixed[3]?.E_m,
      month5Energy: jrcData.outputs.monthly.fixed[4]?.E_m,
      month6Energy: jrcData.outputs.monthly.fixed[5]?.E_m,
      month7Energy: jrcData.outputs.monthly.fixed[6]?.E_m,
      month8Energy: jrcData.outputs.monthly.fixed[7]?.E_m,
      month9Energy: jrcData.outputs.monthly.fixed[8]?.E_m,
      month10Energy: jrcData.outputs.monthly.fixed[9]?.E_m,
      month11Energy: jrcData.outputs.monthly.fixed[10]?.E_m,
      month12Energy: jrcData.outputs.monthly.fixed[11]?.E_m,
      yearlyEnergy: jrcData.outputs.totals.fixed.E_y,
    };

    const savedData = await $fetch(`/api/solar-potential/faverton`, {
      method: `POST`,
      body: dataToSave,
    });

    return savedData;
  }
  catch (error) {
    console.error(`Error saving JRC data in Faverton`, error);
    fetchError.value = error;
    return null;
  }
  finally {
    isSaving.value = false;
  }
};

const fetchSolarData = async () => {
  favertonSolarData.value = null;
  fetchError.value = null;
  isLoading.value = true;

  try {
    if (postalCode.value && city.value) {
      const favertonResponse = await $fetch(`/api/solar-potential/faverton`, {
        query: {
          postalCode: postalCode.value,
          city: city.value,
        },
      });

      if (favertonResponse && favertonResponse.length > 0) {
        favertonSolarData.value = favertonResponse;
        isLoading.value = false;
        return;
      }

      if (lat.value && lon.value) {
        const jrcResponse = await $fetch<PVGISData>(`/api/solar-potential/jrc`, {
          query: {
            lat: lat.value,
            lon: lon.value,
          },
        });

        if (jrcResponse) {
          await saveJRCDataToFaverton(jrcResponse);

          const updatedFavertonRespons = await $fetch(`/api/solar-potential/faverton`, {
            query: {
              postalCode: postalCode.value,
              city: city.value,
            },
          });

          favertonSolarData.value = updatedFavertonRespons;
        }
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
    <FavertonCard :saved-address="featureCollection" />
    <v-app
      class="absolute"
    >
      <CalcNavigationDrawers
        :address-property
        :solar-energy
      />
    </v-app>
  </div>
</template>
