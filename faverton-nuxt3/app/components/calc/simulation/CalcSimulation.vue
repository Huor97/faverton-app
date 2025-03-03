<script setup lang="ts">
import type { NewFeatureCollection } from "~/types/address/new-base-address-national";
import type { PVGISData } from "~/types/potential-solar";

const surface = ref<number>(1);
const lat = ref<number>();
const lon = ref<number>();

const savedAddress = ref<NewFeatureCollection | null>(null);

watch(savedAddress, (newVal) => {
  if (!newVal) return [];
  lat.value = newVal.featureCollection.features[0]?.geometry.coordinates[1];
  lon.value = newVal.featureCollection.features[0]?.geometry.coordinates[0];
});

const { data: solarPotential } = await useFetch<PVGISData>(`api/solar-potential`, {
  query: { lat, lon },
  watch: [lat, lon],
});
</script>

<template>
  <div>
    <div class="z-[999] fixed w-96 left-16 top-20 m-0 p-5 bg-blue">
      <FavertonInputSearch v-model="savedAddress" />
      <FavertonInputSurface v-model="surface" />
    </div>
    <FavertonCard :saved-address />

    <v-app
      class="absolute"
    >
      <CalcNavigationDrawers
        :solar-potential
        :surface
      />
    </v-app>
  </div>
</template>
