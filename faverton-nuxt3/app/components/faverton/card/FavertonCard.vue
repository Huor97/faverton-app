<script setup lang="ts">
import type { FeatureCollection } from "~/types/address/new-base-address-national";

defineProps<{
  savedAddress?: FeatureCollection | null
}>();

// @ts-expect-error: feature does not have a defined type
const geoStyler = feature => ({
  opacity: feature.properties.code / 100000,
});
</script>

<template>
  <LMap
    style="height: 100vh"
    :zoom="6"
    :center="[46, 10]"
    :use-global-leaflet="false"
  >
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
      layer-type="base"
      name="OpenStreetMap"
    />

    <LGeoJson
      :geojson="savedAddress"
      :options-style="geoStyler"
    />
  </LMap>
</template>
