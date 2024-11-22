<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from 'gsap';

const SolarPanelRef = ref<HTMLElement | null>(null);
const btn = ref<HTMLElement | null>(null);

onMounted(() => {
  if (SolarPanelRef.value) {
    gsap.fromTo(
      SolarPanelRef.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: SolarPanelRef.value,
          start: `top 60%`,
          end: `bottom 50%`,
          toggleActions: `play reverse play reverse`,
          // markers: true,
        },
      },
    );
  }
});

onMounted(() => {
  if (btn.value) {
    gsap.fromTo(
      btn.value,
      {
        autoAlpha: 0,
        x: -50,
      },
      {
        autoAlpha: 1,
        x: 0,
        scrollTrigger: {
          trigger: btn.value,
          start: `top 70%`,
          end: `bottom 45%`,
          toggleActions: `play reverse play reverse`,
          // markers: true,
        },
      },
    );
  }
});

const goToWindTurbine = () => {
  navigateTo(`introduction/sustainable-agriculture`);
};
</script>

<template>
  <div class="relative flex flex-col justify-end text-white overflow-hidden">
    <div
      ref="SolarPanelRef"
      class="flex flex-col items-center backdrop-blur-sm"
    >
      <p class="md:w-2/4 p-5">
        <b class="md:text-[32px]">Des Récoltes Fraîches et Durables.</b>
        <span class="text-slate-100 md:text-[32px]">
          Grâce à nos systèmes hydroponiques, nous cultivons des légumes frais avec un minimum de gaspillage d’eau, enrichis par du compost organique et l'énergie de la nature.
        </span>
      </p>
      <span
        ref="btn"
        class="w-2/4 p-5"
      >
        <FavertonBtn
          button="mor information"
          @click="goToWindTurbine"
        />
      </span>
    </div>
  </div>
</template>
