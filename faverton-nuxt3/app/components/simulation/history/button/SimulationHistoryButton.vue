<script setup lang="ts">
const user = useSupabaseUser();
const userId = computed(() => user?.value?.id || null);
</script>

<template>
  <UButton
    to="/simulator/history"
    label="Historique"
    size="xl"
    :disabled="!userId"
  />
</template>
