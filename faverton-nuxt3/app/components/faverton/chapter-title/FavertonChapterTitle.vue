<script setup lang="ts">
const props = defineProps<{
  title: string
}>();
</script>

<template>
  <h2
    class="max-w-96 text-3xl font-semibold"
  >
    <span>
      {{ props.title }}
    </span>
  </h2>
</template>
