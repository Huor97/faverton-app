<script setup lang="ts">
const model = defineModel<number>();
</script>

<template>
  <div class="flex items-center w-full">
    <UInput
      v-model="model"
      type="number"
      :min="1"
      :max="100"
      step="1"
      placeholder="Entrez le surface"
      size="xl"
      class="w-full"
    >
      <template #trailing>
        <span class="ml-2 text-gray-500">m²</span>
      </template>
    </UInput>
  </div>
</template>
