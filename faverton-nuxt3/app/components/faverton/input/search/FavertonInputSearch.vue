<script setup lang="ts">
import type { FeatureCollection } from "~/types/address/base-address-national";
import type { NewFeatureCollection } from "~/types/address/new-base-address-national";

const model = defineModel();

const selected = ref();
const query = ref(``);

const { data: resultAddress } = await useFetch<FeatureCollection>(`api/address`, {
  query: { q: query },
  watch: [query],
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

// Quand une adresse est sélectionnée
function onSelect(item: NewFeatureCollection) {
  model.value = item;
  // Maintenir le texte dans le champ de recherche
  query.value = item?.name;

  // Définir la sélection
  selected.value = item;
  emit(`update:modelValue`, item);
}
</script>

<template>
  <div>
    <UInputMenu
      v-model="selected"
      v-model:query="query"
      :options="proposition"
      option-attribute="name"
      placeholder="Rechercher une adresse"
      size="xl"
      @update:model-value="onSelect"
    />
  </div>
</template>
