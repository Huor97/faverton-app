<script setup lang="ts">
import type { FeatureCollection } from '~~/shared/types/address/base-address-national';
import type { NewFeatureCollection } from '~~/shared/types/address/new-base-address-national';

interface AddressOption {
  name: string
  featureCollection: NewFeatureCollection['featureCollection']
}

const model = defineModel<NewFeatureCollection>();
const loading = ref(false);
const selected = ref();

async function search(q: string) {
  loading.value = true;

  const { data: resultAddress } = await useFetch<FeatureCollection>('api/address', {
    params: { q },
    server: false,
  });

  loading.value = false;
  if (!resultAddress.value?.features?.length) return [];

  return resultAddress.value.features.map(feature => ({
    name: feature.properties.label || `${feature.properties.city} ${feature.properties.postcode}`,
    featureCollection: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: feature.geometry.coordinates,
        },
        properties: {
          postcode: feature.properties.postcode,
          city: feature.properties.city,
        },
      }],
    },
  }));
}

const emit = defineEmits<{
  'update:modelValue': [value: NewFeatureCollection]
  'clickClear': []
}>();

const addressStore = useAddressStore();

function onSelect(item: AddressOption | null) {
  if (!item) return;

  const selectedData: NewFeatureCollection = {
    name: item.name,
    featureCollection: item.featureCollection,
  };

  model.value = selectedData;
  selected.value = item.name;
  selected.value = item;
  emit('update:modelValue', selectedData);
  addressStore.setSavedAddress(selectedData);
}
</script>

<template>
  <div>
    <UInputMenu
      v-model="selected"
      :search="search"
      :loading="loading"
      placeholder="Rechercher une adresse..."
      option-attribute="name"
      trailing
      size="xl"
      @update:model-value="onSelect"
    />
  </div>
</template>
