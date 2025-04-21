<script setup lang="ts">
const modelValue = defineModel(`modelValue`);
const selected = ref();
const query = ref<string | undefined>();

const { data: allPanels } = await useFetch(`/api/panels`);
const panels = allPanels.value || [];

const selectedModel = computed(() => selected.value?.model || null);

const { data: onePanel } = await useFetch(`/api/panel`, {
  query: { model: selectedModel },
  watch: [selectedModel],
});

const panelId = computed(() => onePanel.value?.[0]?.panel_id || null);

watch(panelId, (newPanel) => {
  if (newPanel) {
    modelValue.value = newPanel;
  }
});
</script>

<template>
  <USelectMenu
    v-model="selected"
    v-model:query="query"
    :options="panels"
    placeholder="Select panel"
    size="xl"
    option-attribute="model"
  />
</template>
