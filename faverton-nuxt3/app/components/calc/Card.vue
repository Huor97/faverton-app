<script setup lang="ts">
import type { PropertiesAddress } from "~/types/address/search";

const searchTerm = ref<string>(``);

const { data, isLoading, error, refetch } = useAddressSearch(searchTerm);

const items = computed(
  () =>
    data.value?.features?.map((feature: PropertiesAddress) => ({
      title: feature.properties.label,
      value: feature,
    })) ?? [],
);

const emit = defineEmits<{
  (e: `update:modelValue`, value: PropertiesAddress | null): void
  (e: `clickClear`): void
}>();

watch(searchTerm, () => {
  const timeout = setTimeout(() => {
    refetch();
  }, 300);
  return () => clearTimeout(timeout);
});

const selectedFeature = ref<PropertiesAddress | null>(null);

const onSelect = (item: PropertiesAddress | null) => {
  selectedFeature.value = item;
  emit(`update:modelValue`, item);
};

// @ts-expect-error: value does not have a type definition
const haveAddress = computed(() => selectedFeature.value?.value);

// @ts-expect-error: feature does not have a type definition
const geoStyler = feature => ({
  opacity: feature.properties.code / 100000,
});
</script>

<template>
  <div>
    <div class="z-[999] fixed w-96 left-16 top-20 m-0 p-5 bg-blue">
      <VAutocomplete
        v-model="selectedFeature"
        v-model:search="searchTerm"
        label="Search..."
        :items="items"
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
    </div>

    <LMap
      style="height: 100vh"
      :zoom="8"
      :center="[47.21322, -1.559482]"
      :use-global-leaflet="false"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />
      <LGeoJson
        :geojson="haveAddress"
        :options-style="geoStyler"
      />
    </LMap>
  </div>
</template>
