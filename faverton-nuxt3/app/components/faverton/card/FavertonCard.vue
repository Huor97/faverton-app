<script setup lang="ts">
const isOpen = ref(false);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div
    :class="isOpen? 'h-[50vh]' : 'h-[100%]'"
    class="rounded-lg overflow-hidden shadow-inner mx-5 my-10 p-5 bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200"
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
