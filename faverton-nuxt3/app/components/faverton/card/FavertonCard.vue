<script setup lang="ts">
const isOpen = ref(false);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div
    class="fixed z-[9000] bottom-0 md:h-[90vh] md:w-[33vw] md:top-10 md:left-3 overflow-auto transition-all duration-500 ease-in-out"
    :class="isOpen? 'h-[50vh]' : 'h-[100%]'"
    style="background: linear-gradient(to bottom, rgba(149, 215, 183, 0.8), #E8FFD7);"
  >
    <div
      class="md:hidden rounded-b-lg flex justify-center p-2"
    >
      <UButton
        class="transition-transform duration-300 ease-in-out"
        :class="{ 'rotate-180': isOpen }"
        @click="toggleMenu"
      >
        <UIcon
          name="i-tabler-chevron-up"
          class="text-lg"
        />
      </UButton>
    </div>

    <slot />
  </div>
</template>
