<script setup lang="ts">
defineProps<{
  label?: string
  infoBol?: string
}>();
</script>

<template>
  <div class="relative text-[#000000]">
    <h2
      class="absolute -left-2 -top-3 w-8 h-8 text-center rounded-full bg-[#E4ECEE] shadow-xl border border-white text-xl"
    >
      {{ infoBol }}
    </h2>
    <div>
      <p class=" text-sm md:text-base  bg-gradient-to-r from-[#FEFEFE]/30 to-[#FFE49E] rounded-2xl p-5">
        {{ label }}
      </p>
    </div>
  </div>
</template>
