<script setup lang="ts">
import type { FeatureCollection } from "~/types/address/base-address-national";
import type { NewFeatureCollection } from "~/types/address/new-base-address-national";
import { useAddressStore } from '~/stores/address';

const model = defineModel();

const selected = ref();
const searchAddress = ref(``);

const { data: resultAddress } = await useFetch<FeatureCollection>(`api/address`, {
  query: { q: searchAddress },
  watch: [searchAddress],
});

// Formater les résultats pour qu'ils soient compatibles avec UInputMenu
const proposition = computed(() => {
  if (!resultAddress.value || !resultAddress.value.features) return [];

  return resultAddress.value.features.map((feature) => {
    return {
      name: feature.properties.label || `${feature.properties.city} ${feature.properties.postcode}`,

      featureCollection: {
        type: `FeatureCollection`,
        features: [
          {
            type: `Feature`,
            geometry: {
              type: `Point`,
              coordinates: feature.geometry.coordinates,
            },
            properties: {
              postcode: feature.properties.postcode,
              city: feature.properties.city,
            },
          },
        ],
      },
    };
  });
});

const emit = defineEmits<{
  (e: `update:modelValue`, value: NewFeatureCollection): void
  (e: `clickClear`): void
}>();

const addressStore = useAddressStore();

function onSelect(item: NewFeatureCollection) {
  model.value = item;
  searchAddress.value = item?.name;
  selected.value = item;
  emit(`update:modelValue`, item);
  addressStore.setSavedAddress(item);
}
</script>

<template>
  <div>
    <UInputMenu
      v-model="selected"
      v-model:query="searchAddress"
      :options="proposition"
      option-attribute="name"
      placeholder="Rechercher une adresse"
      size="xl"
      class="w-[30vw]"
      @update:model-value="onSelect"
    />
  </div>
</template>
