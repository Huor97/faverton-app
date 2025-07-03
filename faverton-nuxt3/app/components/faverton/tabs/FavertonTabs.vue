<script setup lang="ts">
const props = defineProps<{
  activeResult: boolean
}>();

const model = defineModel<number>('modelValue');
const items = computed(() => [
  {
    label: 'Toiture',
    icon: 'i-heroicons-home',
    value: 0,
  },
  {
    label: 'Résultats',
    icon: 'i-heroicons-chart-bar-square',
    value: 1,
    disabled: props.activeResult,
  },
  {
    label: 'Historique',
    icon: 'i-heroicons-outline-collection',
    value: 2,
  },
]);
</script>

<template>
  <UTabs
    v-model="model"
    class="m-0 px-2 md:px-6 mb-8"
    :items="items"
  >
    <template #default="{ item }">
      <div class="md:text-xl">
        {{ item.label }}
      </div>
    </template>
  </UTabs>
</template>
