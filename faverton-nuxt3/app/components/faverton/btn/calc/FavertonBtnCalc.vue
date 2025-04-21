<script setup lang="ts">
const modelValue = defineModel<boolean>();
const activeTab = computed({
  get: () => modelValue.value ? 1 : 0,
  set: (value: number) => { modelValue.value = value === 1; },
});

const items = [
  {
    label: `Toiture`,
    icon: `i-heroicons-home`,
    value: 0,
  },
  {
    label: `Résultats`,
    icon: `i-heroicons-chart-bar-square`,
    value: 1,
  },
];
</script>

<template>
  <UTabs
    v-model="activeTab"
    :items="items"
  />
</template>
