<script setup lang="ts">
const props = defineProps<{
  pargraphe: string
}>();
</script>

<template>
  <p
    class="max-w-80"
  >
    <slot>
      {{ props.pargraphe }}
    </slot>
  </p>
</template>
