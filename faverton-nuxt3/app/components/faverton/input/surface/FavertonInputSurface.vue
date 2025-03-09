<script setup lang="ts">
const state = reactive({
  inputValue: 1,
});
</script>

<template>
  <UInput
    v-model="state.inputValue"
    type="number"
    :min="1"
    :max="100"
    step="1"
    placeholder="Entrez le surface"
    size="xl"
  />
</template>
