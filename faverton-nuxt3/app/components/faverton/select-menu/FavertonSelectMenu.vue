<script setup lang="ts">
const modelValue = defineModel<string | null>('modelValue');
const selected = ref();
const query = ref<string | undefined>();

const { data: allPanels } = await useFetch<Panel[]>('/api/panels', {
  server: false,
});

const panels = computed(() => {
  if (!allPanels.value?.length) return [];

  return allPanels.value.map(panel => ({
    ...panel,
    displayLabel: `${panel.model} - rendement ${panel.efficiency}% - ${panel.detail}`,
  }));
});

const { data: onePanel } = await useFetch<Panel[]>('/api/panel', {
  query: computed(() => ({ model: selected.value?.model })),
  watch: [() => selected.value?.model],
  server: false,
});

watch(() => onePanel.value?.[0]?.panel_id, (newPanelId) => {
  if (newPanelId) {
    modelValue.value = newPanelId;
  }
}, { immediate: true });
</script>

<template>
  <USelectMenu
    v-model="selected"
    v-model:query="query"
    :options="panels"
    placeholder="Sélectionner un panneau"
    size="xl"
    option-attribute="displayLabel"
    :search-attributes="['model', 'efficiency']"
  />
</template>
