<script setup lang="ts">
const props = defineProps<{
  activeResult: boolean
}>();

const model = defineModel<number>();
const items = computed(() => [
  {
    label: `Toiture`,
    icon: `i-heroicons-home`,
    value: 0,
  },
  {
    label: `Résultats`,
    icon: `i-heroicons-chart-bar-square`,
    value: 1,
    disabled: props.activeResult,
  },
  {
    label: `Historique`,
    icon: `i-heroicons-outline-collection`,
    value: 2,
  },
]);
</script>

<template>
  <UTabs
    v-model="model"
    :items="items"
    class="m-0 px-6 mb-5"
  />
</template>
