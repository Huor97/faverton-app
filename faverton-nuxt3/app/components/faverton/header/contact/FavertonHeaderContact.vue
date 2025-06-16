<template>
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">
      {{ title }}
    </h1>
    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>();
</script>
