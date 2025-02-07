<script setup lang="ts">
const props = defineProps<{
  drawer: boolean
}>();
const emit = defineEmits([`update:drawer`]);
</script>

<template>
  <VNavigationDrawer
    permanent
    location="right"
    :width="50"
  >
    <template #append>
      <VBtn
        :icon="drawer ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        @click.stop="emit('update:drawer', !props.drawer)"
      />
    </template>
  </VNavigationDrawer>
</template>
