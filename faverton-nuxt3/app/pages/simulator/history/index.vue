<script setup lang="ts">
definePageMeta({
  middleware: [`auth`],
});
</script>

<template>
  <div>
    <CalcSimulationHistory />
  </div>
</template>
