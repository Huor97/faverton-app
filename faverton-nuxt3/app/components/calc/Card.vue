<script setup lang="ts">
import { useSolarPotential } from "~/composables/useSolarPotential";
import type { FeatureCollection, Feature } from "~/types/address/search";

const searchTerm = ref<string>(``);

const { data, isLoading, error, refetch } = useAddressSearch(searchTerm);

const items = computed(
  () =>
    data.value?.features?.map((feature: Feature) => ({
      title: feature.properties.label,
      features: feature,
    })) ?? [],
);

const emit = defineEmits<{
  (e: `update:modelValue`, value: FeatureCollection | null): void
  (e: `clickClear`): void
}>();

watch(searchTerm, () => {
  const timeout = setTimeout(refetch, 300);
  return () => clearTimeout(timeout);
});

const selectedFeatureCollection = ref<FeatureCollection | null>(null);
const coordinates = ref<Array<number>>([]);

const { data: solarPotential, isLoading: solarLoading, error: solarError } = useSolarPotential(coordinates);

const onSelect = (item: FeatureCollection | null) => {
  selectedFeatureCollection.value = item;
  coordinates.value = item?.features.geometry.coordinates ?? [];
  emit(`update:modelValue`, item);
};

// @ts-expect-error: feature does not have a defined type
const geoStyler = feature => ({
  opacity: feature.properties.code / 100000,
});

// surface
const inputValue = ref<number>(1);
const surface = ref<number>(1);
const validate = (inputValue) => {
  if (inputValue < 1 || inputValue > 100) {
    return `La valeur doit être entre 1 et 100`;
  }
  return true;
};
const onSubmit = () => {
  // Traitement après soumission
  surface.value = inputValue.value;
  console.log(`Valeur soumise:`, surface.value);
};
</script>

<template>
  <div>
    <div class="z-[999] fixed w-96 left-16 top-20 m-0 p-5 bg-blue">
      <VAutocomplete
        v-model="selectedFeatureCollection"
        v-model:search="searchTerm"
        label="Search..."
        :items
        :loading="isLoading"
        variant="outlined"
        item-title="title"
        item-value="value"
        return-object
        @update:model-value="onSelect"
      >
        <template #no-data>
          <VListItem v-if="isLoading">
            <VProgressCircular indeterminate />
          </VListItem>
          <VListItem v-else-if="error">
            {{ error }}
          </VListItem>
          <VListItem v-else>
            No results found
          </VListItem>
        </template>
      </VAutocomplete>
      <UForm
        :validate="validate"
        @submit="onSubmit"
      >
        <UFormGroup label="Entrez un nombre entre 1 et 100">
          <UInput
            v-model="inputValue"
            type="number"
            :min="1"
            :max="100"
            step="1"
          />
        </UFormGroup>
        <UButton type="submit">
          Soumettre
        </UButton>
      </UForm>
    </div>

    <LMap
      style="height: 100vh"
      :zoom="5"
      :center="[50, 19]"
      :use-global-leaflet="false"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />
      <LGeoJson
        :geojson="selectedFeatureCollection?.features"
        :options-style="geoStyler"
      />
    </LMap>
    <v-app
      v-if="!solarError"
      class="absolute"
    >
      <CalcNavigationDrawers
        :solar-potential
        :solar-loading
        :surface
      />
    </v-app>
  </div>
</template>
