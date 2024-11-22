<script setup lang="ts">
const props = defineProps<{
  button: string
}>();
</script>

<template>
  <NuxtLink
    to="/"
    class="text-3xl border-2 border-black p-2 hover:bg-sky-700 hover:text-white"
  >
    <slot>
      {{ props.button }}
    </slot>
  </NuxtLink>
</template>
