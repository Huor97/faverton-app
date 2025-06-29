<script setup lang="ts">
defineProps<{
  label?: string
  infoBol?: string
}>();
</script>

<template>
  <div class="relative">
    <h2
      class="absolute -left-2 -top-3 w-8 h-8 text-center rounded-full bg-[#FF7557] shadow-xl border border-white text-xl"
    >
      {{ infoBol }}
    </h2>
    <div>
      <p class=" text-sm md:text-base text-[#29235C] bg-gradient-to-r from-[#FF7557]/70 to-[#FFE49E] rounded-2xl p-5">
        {{ label }}
      </p>
    </div>
  </div>
</template>
