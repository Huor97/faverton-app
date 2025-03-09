<script setup lang="ts">
const model = defineModel<boolean>();
</script>

<template>
  <VNavigationDrawer
    permanent
    location="right"
    :width="50"
  >
    <template #append>
      <VBtn
        :icon="model ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        variant="text"
        @click.stop="model = !model"
      />
    </template>
  </VNavigationDrawer>
</template>
