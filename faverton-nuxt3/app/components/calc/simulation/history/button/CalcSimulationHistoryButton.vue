<script setup lang="ts">
const user = useSupabaseUser();

const goToHistory = () => {
  if (user?.value?.id == null) {
    navigateTo(`/user/login`);
  }
  else {
    navigateTo(`/simulator/history`);
  }
};
</script>

<template>
  <UButton
    label="Historique"
    size="xl"
    @click="goToHistory"
  />
</template>
