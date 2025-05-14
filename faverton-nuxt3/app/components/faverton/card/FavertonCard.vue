<script setup lang="ts">
const isOpen = ref(false);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div
    class="fixed z-[9000] bottom-0 md:h-[90vh] md:w-[33vw] md:top-10 md:left-3 overflow-auto"
    :class="isOpen? 'h-[50vh]' : 'h-[100%]'"
    style="background: linear-gradient(to bottom, rgba(149, 215, 183, 0.8), #E8FFD7);"
  >
    <UButton
      class="md:hidden"
      @click="toggleMenu"
    >
      <UIcon
        :name="isOpen ? 'i-tabler-arrows-diagonal' : 'i-tabler-arrows-diagonal-minimize-2'"
        class="text-lg"
      />
      {{ isOpen ? 'Agrandir' : 'Réduire' }}
    </UButton>
    <slot />
  </div>
</template>
